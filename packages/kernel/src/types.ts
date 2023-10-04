import type { PyodideInterface } from "pyodide";

export type PyodideConvertiblePrimitive =
  | string
  | number
  | boolean
  | null
  | undefined; // Ref: https://pyodide.org/en/stable/usage/type-conversions.html#javascript-to-python

export interface HttpRequest {
  method: "GET" | "POST";
  path: string;
  headers: Record<string, string>;
  body: ArrayBuffer | string;
}
export interface HttpResponse {
  statusCode: number;
  headers: Map<string, string>;
  body: Uint8Array;
}
export interface EmscriptenFile {
  data: string | ArrayBufferView;
  opts?: Record<string, string>;
}
export interface EmscriptenFileUrl {
  url: string;
  opts?: Record<string, string>;
}
export interface PyodideArchive {
  buffer: Parameters<PyodideInterface["unpackArchive"]>[0];
  format: Parameters<PyodideInterface["unpackArchive"]>[1];
  options?: Parameters<PyodideInterface["unpackArchive"]>[2];
}
export interface PyodideArchiveUrl {
  url: string;
  format: Parameters<PyodideInterface["unpackArchive"]>[1];
  options?: Parameters<PyodideInterface["unpackArchive"]>[2];
}
export interface StreamlitConfig {
  [key: string]: PyodideConvertiblePrimitive;
}
export interface WorkerInitialData {
  entrypoint: string;
  files: Record<string, EmscriptenFile | EmscriptenFileUrl>;
  archives: Array<PyodideArchive | PyodideArchiveUrl>;
  requirements: string[];
  pyodideUrl?: string;
  wheels?: {
    stliteServer: string;
    streamlit: string;
  };
  mountedSitePackagesSnapshotFilePath?: string;
  streamlitConfig?: StreamlitConfig;
}

/**
 * Input messages from kernel to worker
 */
interface InMessageBase {
  type: string;
  data?: unknown;
}
export interface InMessageInitData extends InMessageBase {
  type: "initData";
  data: WorkerInitialData;
}
export interface InMessageWebSocketConnect extends InMessageBase {
  type: "websocket:connect";
  data: {
    path: string;
  };
}
export interface InMessageWebSocketSend extends InMessageBase {
  type: "websocket:send";
  data: {
    payload: Uint8Array;
  };
}
export interface InMessageHttpRequest extends InMessageBase {
  type: "http:request";
  data: {
    request: HttpRequest;
  };
}
export interface InMessageFileWrite extends InMessageBase {
  type: "file:write";
  data: {
    path: string;
    data: string | ArrayBufferView;
    opts?: Record<string, any>;
  };
}
export interface InMessageFileRename extends InMessageBase {
  type: "file:rename";
  data: {
    oldPath: string;
    newPath: string;
  };
}
export interface InMessageFileUnlink extends InMessageBase {
  type: "file:unlink";
  data: {
    path: string;
  };
}
export interface InMessageInstall extends InMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}
export type InMessage =
  | InMessageInitData
  | InMessageWebSocketConnect
  | InMessageWebSocketSend
  | InMessageHttpRequest
  | InMessageFileWrite
  | InMessageFileRename
  | InMessageFileUnlink
  | InMessageInstall;

export interface StliteWorker extends Worker {
  postMessage(message: InMessage, transfer: Transferable[]): void;
  postMessage(message: InMessage, options?: StructuredSerializeOptions): void;
}

/**
 * Output messages from worker to kernel
 */
interface OutMessageBase {
  type: string;
  data?: unknown;
}
export interface OutMessageStartEvent extends OutMessageBase {
  type: "event:start";
}
export interface OutMessageProgressEvent extends OutMessageBase {
  type: "event:progress";
  data: {
    message: string;
  };
}
export interface OutMessageErrorEvent extends OutMessageBase {
  type: "event:error";
  data: {
    error: Error;
  };
}
export interface OutMessageLoadedEvent extends OutMessageBase {
  type: "event:loaded";
}
export interface OutMessageWebSocketBack extends OutMessageBase {
  type: "websocket:message";
  data: {
    payload: Uint8Array;
  };
}
export type OutMessage =
  | OutMessageStartEvent
  | OutMessageProgressEvent
  | OutMessageErrorEvent
  | OutMessageLoadedEvent
  | OutMessageWebSocketBack;

/**
 * Reply message to InMessage
 */
interface ReplyMessageBase {
  type: string;
  error?: Error;
  data?: any;
}
export interface ReplyMessageHttpResponse extends ReplyMessageBase {
  type: "http:response";
  data: {
    response: HttpResponse;
  };
}
export interface ReplyMessageGeneralReply extends ReplyMessageBase {
  type: "reply";
  error?: Error;
}
export type ReplyMessage = ReplyMessageHttpResponse | ReplyMessageGeneralReply;

/**
 * Validators
 */
export function isPyodideConvertiblePrimitive(
  value: unknown
): value is PyodideConvertiblePrimitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}
export function isStreamlitConfig(value: unknown): value is StreamlitConfig {
  return (
    typeof value === "object" &&
    value != null &&
    Object.entries(value).every(
      ([key, value]) =>
        typeof key === "string" && isPyodideConvertiblePrimitive(value)
    )
  );
}
export function assertStreamlitConfig(
  value: unknown
): asserts value is StreamlitConfig {
  if (!isStreamlitConfig(value)) {
    throw new Error(`Invalid streamlitConfig: ${value}`);
  }
}
