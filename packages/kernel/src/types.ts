import type { PyodideInterface } from "pyodide";

export interface HttpRequest {
  method: "GET" | "POST";
  path: string;
  headers: { [key: string]: string };
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
  options: Parameters<PyodideInterface["unpackArchive"]>[2];
}
export interface PyodideArchiveUrl {
  url: string;
  format: Parameters<PyodideInterface["unpackArchive"]>[1];
  options: Parameters<PyodideInterface["unpackArchive"]>[2];
}
export interface WorkerInitialData {
  entrypoint: string;
  files: Record<string, EmscriptenFile | EmscriptenFileUrl>;
  archives: Array<PyodideArchive | PyodideArchiveUrl>;
  requirements: string[];
  pyodideEntrypointUrl?: string;
  wheels?: {
    stliteServer: string;
    streamlit: string;
  };
  mountedSitePackagesSnapshotFilePath?: string;
}

/**
 * Input messages from kernel to worker
 */
interface InMessageBase {
  type: string;
  data?: unknown;
}
export interface InitDataMessage extends InMessageBase {
  type: "initData";
  data: WorkerInitialData;
}
export interface WebSocketConnectMessage extends InMessageBase {
  type: "websocket:connect";
  data: {
    path: string;
  };
}
export interface WebSocketSendMessage extends InMessageBase {
  type: "websocket:send";
  data: {
    payload: Uint8Array;
  };
}
export interface HttpRequestMessage extends InMessageBase {
  type: "http:request";
  data: {
    request: HttpRequest;
  };
}
export interface FileWriteMessage extends InMessageBase {
  type: "file:write";
  data: {
    path: string;
    data: string | ArrayBufferView;
    opts?: Record<string, any>;
  };
}
export interface FileRenameMessage extends InMessageBase {
  type: "file:rename";
  data: {
    oldPath: string;
    newPath: string;
  };
}
export interface FileUnlinkMessage extends InMessageBase {
  type: "file:unlink";
  data: {
    path: string;
  };
}
export interface InstallMessage extends InMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}
export type InMessage =
  | InitDataMessage
  | WebSocketConnectMessage
  | WebSocketSendMessage
  | HttpRequestMessage
  | FileWriteMessage
  | FileRenameMessage
  | FileUnlinkMessage
  | InstallMessage;

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
export interface StartEventMessage extends OutMessageBase {
  type: "event:start";
}
export interface ProgressEventMessage extends OutMessageBase {
  type: "event:progress";
  data: {
    message: string;
  };
}
export interface ErrorEventMessage extends OutMessageBase {
  type: "event:error";
  data: {
    error: Error;
  };
}
export interface LoadedEventMessage extends OutMessageBase {
  type: "event:loaded";
}
export interface WebSocketBackMessage extends OutMessageBase {
  type: "websocket:message";
  data: {
    payload: Uint8Array;
  };
}
export type OutMessage =
  | StartEventMessage
  | ProgressEventMessage
  | ErrorEventMessage
  | LoadedEventMessage
  | WebSocketBackMessage;

/**
 * Reply message to InMessage
 */
interface ReplyMessageBase {
  type: string;
  error?: Error;
  data?: any;
}
export interface HttpResponseMessage extends ReplyMessageBase {
  type: "http:response";
  data: {
    response: HttpResponse;
  };
}
export interface GeneralReplyMessage extends ReplyMessageBase {
  type: "reply";
  error?: Error;
}
export type ReplyMessage = HttpResponseMessage | GeneralReplyMessage;
