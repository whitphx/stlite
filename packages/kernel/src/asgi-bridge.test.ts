import type { PyodideInterface } from "pyodide";
import { afterAll, beforeAll, expect, suite, test } from "vitest";
import { mockPyArrow } from "./mock";
import { initPyodide } from "./pyodide-loader";
import {
  AsgiWebSocketSession,
  buildWebSocketScope,
  dispatchHttp,
  type AsgiApp,
  type AsgiEvent,
} from "./asgi-bridge";
import { getWheelUrls, pyodideUrl } from "./test-utils";

const SPIKE_SCRIPT = `
import streamlit as st

st.write("Hello from the ASGI spike!")
`;

suite("ASGI bridge spike", { timeout: 120 * 1000 }, () => {
  let pyodide: PyodideInterface;
  let asgiApp: AsgiApp;
  let lifespanState: unknown;

  beforeAll(async () => {
    pyodide = await initPyodide(pyodideUrl, {});

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");

    mockPyArrow(pyodide);

    const wheels = getWheelUrls();
    // Mirror worker-runtime.ts: pin protobuf >= 7.34.1 ahead of the
    // streamlit wheel so micropip resolves the PyPI 7.x wheel rather
    // than falling back to Pyodide's bundled 6.31.1 (Streamlit 1.57.0
    // gencode requires 7.x).
    await micropip.install.callKwargs(
      ["protobuf>=7.34.1,<8", wheels.streamlit, wheels.stliteLib],
      { keep_going: true },
    );

    pyodide.FS.writeFile("/spike_app.py", SPIKE_SCRIPT);

    const asgiModule = pyodide.pyimport("stlite_lib.asgi_app");
    const rawApp = asgiModule.create_app("/spike_app.py");
    // JS-side scope objects need conversion to Python dicts at the boundary.
    asgiApp = (scope, receive, send) =>
      asgiModule.call_asgi(rawApp, scope, receive, send);
    lifespanState = await asgiModule.run_lifespan_startup(rawApp);
  });

  afterAll(async () => {
    if (lifespanState && pyodide) {
      const { run_lifespan_shutdown } = pyodide.pyimport("stlite_lib.asgi_app");
      await run_lifespan_shutdown(lifespanState);
    }
  });

  test("GET /_stcore/health returns ok", async () => {
    const response = await dispatchHttp(asgiApp, {
      method: "GET",
      path: "/_stcore/health",
      headers: { host: "stlite.local" },
      body: "",
    });

    expect(response.statusCode).toBe(200);
    const bodyText = new TextDecoder().decode(response.body);
    expect(bodyText).toBe("ok");
  });

  test("WebSocket session: BackMsg(rerun) round-trips with ForwardMsg bytes", async () => {
    // End-to-end WebSocket round-trip through the ASGI bridge:
    //   1. JS opens the WS (websocket.connect → server accept)
    //   2. JS sends a rerun BackMsg (the Streamlit frontend's first
    //      message on every fresh connect)
    //   3. server runs the script, queues NewSession + element Deltas +
    //      ScriptFinished via StarletteSessionClient.write_forward_msg
    //   4. those flow through the background sender task → ASGI send →
    //      our onServerSend callback as websocket.send events with
    //      Uint8Array `bytes`
    // Catching one server-sent bytes event proves the full duplex path.
    let resolveFirstBytes!: (event: AsgiEvent) => void;
    let rejectFirstBytes!: (err: Error) => void;
    const firstBytes = new Promise<AsgiEvent>((resolve, reject) => {
      resolveFirstBytes = resolve;
      rejectFirstBytes = reject;
    });

    let firstBytesSeen = false;
    const scope = buildWebSocketScope({
      path: "/_stcore/stream",
      headers: {
        host: "stlite.local",
        origin: "http://stlite.local",
      },
    });
    const session = new AsgiWebSocketSession(asgiApp, scope, (event) => {
      if (firstBytesSeen) return;
      if (event.type === "websocket.send" && event.bytes) {
        firstBytesSeen = true;
        resolveFirstBytes(event);
      } else if (event.type === "websocket.close") {
        rejectFirstBytes(
          new Error(
            `WebSocket closed before any bytes arrived (code=${event.code ?? "?"})`,
          ),
        );
      }
    });

    const subprotocol = await session.start();
    // No explicit subprotocol negotiation in this minimal scope.
    expect(subprotocol).toBeNull();

    // Build a rerun BackMsg on the Python side so the test doesn't need
    // its own protobufjs build. Empty ClientState is enough to request
    // a fresh script run.
    const backMsgProxy = pyodide.runPython(`
from streamlit.proto.BackMsg_pb2 import BackMsg
from streamlit.proto.ClientState_pb2 import ClientState
BackMsg(rerun_script=ClientState()).SerializeToString()
`);
    const backMsg = backMsgProxy.toJs() as Uint8Array;
    backMsgProxy.destroy();
    session.postClientMessage(backMsg);

    const event = await firstBytes;
    const bytes = event.bytes as Uint8Array;
    expect(bytes.byteLength).toBeGreaterThan(0);

    await session.close();
  });

  test("Multi-App: two independent Apps coexist in the same Pyodide process", async () => {
    // Scoping check for the SharedWorker model (one Pyodide hosting multiple
    // appIds, each with its own Runtime). Construct two App instances pointing
    // at distinct scripts, drive both lifespans, then exercise each one over
    // its own WebSocket. The fact that both sessions independently emit
    // ForwardMsg bytes proves:
    //   * App() / Runtime() instances don't collide with each other in one
    //     Pyodide process (no hidden module-level singletons)
    //   * call_asgi's per-task `runtime_contextvar.set(app._runtime)` correctly
    //     dispatches each session's BackMsg to its own Runtime
    //   * Two ASGI lifespan tasks (one per App) can run side-by-side
    pyodide.FS.writeFile(
      "/spike_app_a.py",
      'import streamlit as st\nst.write("App A")\n',
    );
    pyodide.FS.writeFile(
      "/spike_app_b.py",
      'import streamlit as st\nst.write("App B")\n',
    );

    const asgiModule = pyodide.pyimport("stlite_lib.asgi_app");
    const rawAppA = asgiModule.create_app("/spike_app_a.py");
    const rawAppB = asgiModule.create_app("/spike_app_b.py");

    const lifespanA = await asgiModule.run_lifespan_startup(rawAppA);
    const lifespanB = await asgiModule.run_lifespan_startup(rawAppB);

    try {
      const callA: AsgiApp = (scope, receive, send) =>
        asgiModule.call_asgi(rawAppA, scope, receive, send);
      const callB: AsgiApp = (scope, receive, send) =>
        asgiModule.call_asgi(rawAppB, scope, receive, send);

      const backMsgProxy = pyodide.runPython(`
from streamlit.proto.BackMsg_pb2 import BackMsg
from streamlit.proto.ClientState_pb2 import ClientState
BackMsg(rerun_script=ClientState()).SerializeToString()
`);
      const backMsg = backMsgProxy.toJs() as Uint8Array;
      backMsgProxy.destroy();

      async function runSessionRoundTrip(call: AsgiApp): Promise<Uint8Array> {
        let resolveBytes!: (b: Uint8Array) => void;
        let rejectBytes!: (err: Error) => void;
        const bytesPromise = new Promise<Uint8Array>((resolve, reject) => {
          resolveBytes = resolve;
          rejectBytes = reject;
        });

        let captured = false;
        const scope = buildWebSocketScope({
          path: "/_stcore/stream",
          headers: {
            host: "stlite.local",
            origin: "http://stlite.local",
          },
        });
        const session = new AsgiWebSocketSession(call, scope, (event) => {
          if (captured) return;
          if (event.type === "websocket.send" && event.bytes) {
            captured = true;
            resolveBytes(event.bytes as Uint8Array);
          } else if (event.type === "websocket.close") {
            rejectBytes(
              new Error(
                `WebSocket closed before bytes (code=${event.code ?? "?"})`,
              ),
            );
          }
        });
        await session.start();
        session.postClientMessage(backMsg);
        const bytes = await bytesPromise;
        await session.close();
        return bytes;
      }

      const [bytesA, bytesB] = await Promise.all([
        runSessionRoundTrip(callA),
        runSessionRoundTrip(callB),
      ]);

      expect(bytesA.byteLength).toBeGreaterThan(0);
      expect(bytesB.byteLength).toBeGreaterThan(0);
    } finally {
      await asgiModule.run_lifespan_shutdown(lifespanA);
      await asgiModule.run_lifespan_shutdown(lifespanB);
    }
  });
});
