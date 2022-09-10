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
  command: "run" | "hello";
  entrypoint: string;
  files: Record<string, EmscriptenFile>;
  requirements: string[];
  wheels: {
    tornado: string;
    pyarrow: string;
    streamlit: string;
  };
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
    httpCommId: number;
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
interface LoadedEventMessage extends OutMessageBase {
  type: "event:loaded";
}
interface WebSocketBackMessage extends OutMessageBase {
  type: "websocket:message";
  data: {
    payload: Uint8Array;
  };
}
interface HttpResponseMessage extends OutMessageBase {
  type: "http:response";
  data: {
    httpCommId: number;
    response: HttpResponse;
  };
}
type OutMessage =
  | StartEventMessage
  | ProgressEventMessage
  | LoadedEventMessage
  | WebSocketBackMessage
  | HttpResponseMessage;

/**
 * Reply message
 */
interface ReplyMessage {
  type: "reply";
  error?: any;
}
