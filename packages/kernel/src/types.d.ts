interface HttpRequest {
  method: "GET" | "POST";
  path: string;
  headers: { [key: string]: string };
  body: ArrayBuffer | string;
}
interface HttpResponse {
  statusCode: number;
  headers: Map<string, string>;
  body: Uint8Array;
}
interface EmscriptenFile {
  data: string | ArrayBufferView;
  opts?: Record<string, string>;
}
interface WorkerInitialData {
  entrypoint: string;
  files: Record<string, EmscriptenFile>;
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
interface InitDataMessage extends InMessageBase {
  type: "initData";
  data: WorkerInitialData;
}
interface WebSocketConnectMessage extends InMessageBase {
  type: "websocket:connect";
  data: {
    path: string;
  };
}
interface WebSocketSendMessage extends InMessageBase {
  type: "websocket:send";
  data: {
    payload: Uint8Array;
  };
}
interface HttpRequestMessage extends InMessageBase {
  type: "http:request";
  data: {
    request: HttpRequest;
  };
}
interface FileWriteMessage extends InMessageBase {
  type: "file:write";
  data: {
    path: string;
    data: string | ArrayBufferView;
    opts?: Record<string, any>;
  };
}
interface FileRenameMessage extends InMessageBase {
  type: "file:rename";
  data: {
    oldPath: string;
    newPath: string;
  };
}
interface FileUnlinkMessage extends InMessage {
  type: "file:unlink";
  data: {
    path: string;
  };
}
interface InstallMessage extends InMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}
type InMessage =
  | InitDataMessage
  | WebSocketConnectMessage
  | WebSocketSendMessage
  | HttpRequestMessage
  | FileWriteMessage
  | FileRenameMessage
  | FileUnlinkMessage
  | InstallMessage;

interface StliteWorker extends Worker {
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
interface StartEventMessage extends OutMessageBase {
  type: "event:start";
}
interface ProgressEventMessage extends OutMessageBase {
  type: "event:progress";
  data: {
    message: string;
  };
}
interface ErrorEventMessage extends OutMessageBase {
  type: "event:error";
  data: {
    error: Error;
  };
}
interface LoadedEventMessage extends OutMessageBase {
  type: "event:loaded";
}
interface WebSocketBackMessage extends OutMessageBase {
  type: "websocket:message";
  data: {
    payload: Uint8Array;
  };
}
type OutMessage =
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
interface HttpResponseMessage extends ReplyMessageBase {
  type: "http:response";
  data: {
    response: HttpResponse;
  };
}
interface GeneralReplyMessage extends ReplyMessageBase {
  type: "reply";
  error?: Error;
}
type ReplyMessage = HttpResponseMessage | GeneralReplyMessage;
