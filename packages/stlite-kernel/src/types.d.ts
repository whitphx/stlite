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
interface WorkerInitialData {
  requirements: string[];
  mainScriptData?: string;
}

/**
 * Messages to worker from kernel
 */
interface MessageToWorkerBase {
  type: string;
  data?: unknown;
}
interface InitDataMessage extends MessageToWorkerBase {
  type: "initData";
  data: WorkerInitialData;
}
interface WebSocketConnectMessage extends MessageToWorkerBase {
  type: "websocket:connect";
  data: {
    path: string;
  };
}
interface WebSocketSendMessage extends MessageToWorkerBase {
  type: "websocket:send";
  data: {
    payload: Uint8Array;
  };
}
interface HttpRequestMessage extends MessageToWorkerBase {
  type: "http:request";
  data: {
    httpCommId: number;
    request: HttpRequest;
  };
}
interface MainScriptSetMessage extends MessageToWorkerBase {
  type: "mainscript:set";
  data: {
    mainScriptData: string;
  };
}
type MessageToWorker =
  | InitDataMessage
  | WebSocketConnectMessage
  | WebSocketSendMessage
  | HttpRequestMessage
  | MainScriptSetMessage;

interface StliteWorker extends Worker {
  postMessage(message: MessageToWorker);
}

/**
 * Messages from worker to kernel
 */
interface MessageFromWorkerBase {
  type: string;
  data?: unknown;
}
interface StartEventMessage extends MessageFromWorkerBase {
  type: "event:start";
}
interface LoadedEventMessage extends MessageFromWorkerBase {
  type: "event:loaded";
}
interface WebSocketBackMessage extends MessageFromWorkerBase {
  type: "websocket:message";
  data: {
    payload: Uint8Array;
  };
}
interface HttpResponseMessage extends MessageFromWorkerBase {
  type: "http:response";
  data: {
    httpCommId: number;
    response: HttpResponse;
  };
}
type MessageFromWorker =
  | StartEventMessage
  | LoadedEventMessage
  | WebSocketBackMessage
  | HttpResponseMessage;
