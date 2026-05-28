/**
 * ASGI bridge for driving Streamlit's Starlette app from the JS worker.
 *
 * Replaces the legacy stlite_lib.server.Server emulation: instead of routing
 * HTTP/WebSocket through a hand-rolled server, we pass an ASGI `scope` plus
 * async `receive`/`send` callables straight into Streamlit's upstream
 * Starlette ASGI application.
 *
 * The shape mirrors gradio-lite's webworker/asgi.ts (specifically
 * `makeAsgiRequest`, originally written by whitphx):
 * https://github.com/gradio-app/gradio-lite/blob/main/js/wasm/src/webworker/asgi.ts
 *
 * ASGI spec: https://asgi.readthedocs.io/en/latest/specs/main.html
 */
import type { PyProxy } from "pyodide/ffi";
import type { HttpRequest, HttpResponse } from "./types";

/** ASGI server-info type. The values reflect what we, the "server", advertise. */
const ASGI_VERSION = { version: "3.0", spec_version: "2.3" } as const;
const HTTP_VERSION = "1.1";

/** ASGI event shape: `{type: ..., ...}` with arbitrary additional keys. */
export type AsgiEvent = Record<string, unknown> & { type: string };

/** Async generator-style queue: producers `enqueue`, consumer awaits `dequeue`. */
export class AwaitableQueue<T> {
  private items: T[] = [];
  private waiters: Array<(value: T) => void> = [];

  enqueue(item: T): void {
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter(item);
    } else {
      this.items.push(item);
    }
  }

  dequeue(): Promise<T> {
    const item = this.items.shift();
    if (item !== undefined) {
      return Promise.resolve(item);
    }
    return new Promise((resolve) => {
      this.waiters.push(resolve);
    });
  }
}

/**
 * An ASGI application as called from JS. Pyodide returns a `PyProxy` for the
 * Python `App` instance; calling it as a function dispatches to `App.__call__`,
 * which returns a Python coroutine. The `PyProxy` for that coroutine is
 * awaitable from JS.
 */
export type AsgiApp = (
  scope: AsgiEvent,
  receive: () => Promise<AsgiEvent>,
  send: (event: AsgiEvent | PyProxy) => Promise<void>,
) => Promise<unknown> | PyProxy;

/** ASGI HTTP scope. */
function buildHttpScope(request: HttpRequest): AsgiEvent {
  const url = new URL(request.path, "http://stlite.local");
  const headerEntries: Array<[Uint8Array, Uint8Array]> = Object.entries(
    request.headers,
  ).map(([name, value]) => [
    new TextEncoder().encode(name.toLowerCase()),
    new TextEncoder().encode(value),
  ]);

  return {
    type: "http",
    asgi: ASGI_VERSION,
    http_version: HTTP_VERSION,
    method: request.method.toUpperCase(),
    scheme: "http",
    path: url.pathname,
    raw_path: new TextEncoder().encode(url.pathname),
    query_string: new TextEncoder().encode(url.search.replace(/^\?/, "")),
    root_path: "",
    headers: headerEntries,
    client: ["stlite", 0],
    server: ["stlite", 80],
  };
}

function bodyToBytes(body: HttpRequest["body"]): Uint8Array {
  if (typeof body === "string") {
    return new TextEncoder().encode(body);
  }
  return new Uint8Array(body);
}

/** Convert an event sent by the Python side (PyProxy) into a plain JS dict.
 *
 * We deliberately don't call ``proxy.destroy()``: Pyodide's automatic GC
 * (FinalizationRegistry) reclaims it, and double-destroying the same handle
 * surfaces as "Object has already been destroyed" the next time Pyodide
 * tries to register or release the proxy.
 */
function normalizeSendEvent(event: AsgiEvent | PyProxy): AsgiEvent {
  if (event && typeof (event as PyProxy).toJs === "function") {
    const proxy = event as PyProxy;
    return proxy.toJs({ dict_converter: Object.fromEntries }) as AsgiEvent;
  }
  return event as AsgiEvent;
}

/**
 * Dispatch a single HTTP request through an ASGI app and resolve with the
 * collected response.
 */
export async function dispatchHttp(
  asgiApp: AsgiApp,
  request: HttpRequest,
): Promise<HttpResponse> {
  const scope = buildHttpScope(request);
  const bodyBytes = bodyToBytes(request.body);

  let bodySent = false;
  const receive = async (): Promise<AsgiEvent> => {
    if (bodySent) {
      // Once the request body is drained, ASGI servers send disconnect.
      return { type: "http.disconnect" };
    }
    bodySent = true;
    return {
      type: "http.request",
      body: bodyBytes,
      more_body: false,
    };
  };

  let statusCode = 0;
  const responseHeaders = new Headers();
  const responseChunks: Uint8Array[] = [];

  const send = async (rawEvent: AsgiEvent | PyProxy): Promise<void> => {
    const event = normalizeSendEvent(rawEvent);
    if (event.type === "http.response.start") {
      statusCode = (event.status as number) ?? 0;
      const headers = (event.headers as Array<[Uint8Array, Uint8Array]>) ?? [];
      for (const [name, value] of headers) {
        responseHeaders.append(decodeBytes(name), decodeBytes(value));
      }
    } else if (event.type === "http.response.body") {
      const chunk = event.body as Uint8Array | undefined;
      if (chunk && chunk.byteLength > 0) {
        responseChunks.push(chunk);
      }
    }
  };

  await asgiApp(scope, receive, send);

  const totalLength = responseChunks.reduce((n, c) => n + c.byteLength, 0);
  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of responseChunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { statusCode, headers: responseHeaders, body };
}

/** WebSocket scope helper. */
export interface WebSocketScopeOptions {
  path: string;
  headers?: Record<string, string>;
  subprotocols?: string[];
}

export function buildWebSocketScope(options: WebSocketScopeOptions): AsgiEvent {
  const url = new URL(options.path, "ws://stlite.local");
  const headerEntries: Array<[Uint8Array, Uint8Array]> = Object.entries(
    options.headers ?? {},
  ).map(([name, value]) => [
    new TextEncoder().encode(name.toLowerCase()),
    new TextEncoder().encode(value),
  ]);

  return {
    type: "websocket",
    asgi: ASGI_VERSION,
    http_version: HTTP_VERSION,
    scheme: "ws",
    path: url.pathname,
    raw_path: new TextEncoder().encode(url.pathname),
    query_string: new TextEncoder().encode(url.search.replace(/^\?/, "")),
    root_path: "",
    headers: headerEntries,
    client: ["stlite", 0],
    server: ["stlite", 80],
    subprotocols: options.subprotocols ?? [],
  };
}

/**
 * Wraps an active ASGI WebSocket session. JS owns the channel; the ASGI app
 * runs in the background, draining `receive()` and pushing into `send()`.
 *
 * Lifecycle:
 *   1. Construct → start() returns once the app sends `websocket.accept`.
 *   2. send / postClientMessage as needed.
 *   3. close() → emits `websocket.disconnect`, awaits the app task.
 */
export class AsgiWebSocketSession {
  private receiveQueue = new AwaitableQueue<AsgiEvent>();
  private acceptedResolve!: (subprotocol: string | null) => void;
  private acceptedReject!: (err: Error) => void;
  private acceptedPromise: Promise<string | null>;
  private appTask: Promise<unknown> | null = null;
  private closed = false;

  constructor(
    private readonly asgiApp: AsgiApp,
    private readonly scope: AsgiEvent,
    private readonly onServerSend: (event: AsgiEvent) => void,
  ) {
    this.acceptedPromise = new Promise<string | null>((resolve, reject) => {
      this.acceptedResolve = resolve;
      this.acceptedReject = reject;
    });
  }

  start(): Promise<string | null> {
    this.receiveQueue.enqueue({ type: "websocket.connect" });

    const receive = (): Promise<AsgiEvent> => this.receiveQueue.dequeue();
    const send = async (rawEvent: AsgiEvent | PyProxy): Promise<void> => {
      const event = normalizeSendEvent(rawEvent);
      if (event.type === "websocket.accept") {
        this.acceptedResolve((event.subprotocol as string | null) ?? null);
        return;
      }
      if (event.type === "websocket.close" && !this.closed) {
        this.acceptedReject(
          new Error(
            `WebSocket closed before accept (code=${event.code ?? "?"})`,
          ),
        );
      }
      this.onServerSend(event);
    };

    const result = this.asgiApp(this.scope, receive, send);
    this.appTask = Promise.resolve(result as Promise<unknown>);
    this.appTask.catch((err) => {
      this.acceptedReject(err as Error);
    });
    return this.acceptedPromise;
  }

  postClientMessage(payload: Uint8Array | string): void {
    if (this.closed) return;
    const event: AsgiEvent =
      typeof payload === "string"
        ? { type: "websocket.receive", text: payload }
        : { type: "websocket.receive", bytes: payload };
    this.receiveQueue.enqueue(event);
  }

  async close(code = 1000): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.receiveQueue.enqueue({ type: "websocket.disconnect", code });
    if (this.appTask) {
      try {
        await this.appTask;
      } catch {
        // Disconnect-driven errors are expected.
      }
    }
  }
}

function decodeBytes(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}
