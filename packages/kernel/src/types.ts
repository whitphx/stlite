import type { PyodideInterface, PackageData } from "pyodide";

export type PyodideConvertiblePrimitive =
  | string
  | number
  | boolean
  | null
  | undefined; // Ref: https://pyodide.org/en/stable/usage/type-conversions.html#javascript-to-python

export interface HttpRequest {
  method: "GET" | "PUT" | "DELETE";
  path: string;
  headers: Record<string, string>;
  body: ArrayBuffer | string;
}
export interface HttpResponse {
  statusCode: number;
  headers: Headers;
  body: Uint8Array;
}
export interface HttpResponseInMessage extends Omit<HttpResponse, "headers"> {
  headers: Map<string, string>;
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
  prebuiltPackageNames: string[];
  pyodideUrl?: string;
  wheels?: {
    stliteLib: string;
    streamlit: string;
  };
  streamlitConfig?: StreamlitConfig;
  idbfsMountpoints?: string[];
  nodefsMountpoints?: Record<string, string>;
  moduleAutoLoad: boolean;
  env?: Record<string, string>;
  languageServer?: boolean;
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
export interface InMessageReboot extends InMessageBase {
  type: "reboot";
  data: {
    entrypoint: string;
  };
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
    opts?: Record<string, unknown>;
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
export interface InMessageFileRead extends InMessageBase {
  type: "file:read";
  data: {
    path: string;
    opts?: Record<string, unknown>;
  };
}
export interface InMessageInstall extends InMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}

export interface InMessageSetEnv extends InMessageBase {
  type: "setEnv";
  data: {
    env: Record<string, string>;
  };
}

export interface LanguageServerRequestPayload {
  code: string;
  line: number;
  column: number;
}
export interface InMessageCodeCompletion extends InMessageBase {
  type: "language-server:code_completion";
  data: LanguageServerRequestPayload;
}

export type InMessage =
  | InMessageInitData
  | InMessageReboot
  | InMessageWebSocketConnect
  | InMessageWebSocketSend
  | InMessageHttpRequest
  | InMessageFileWrite
  | InMessageFileRename
  | InMessageFileUnlink
  | InMessageFileRead
  | InMessageInstall
  | InMessageSetEnv
  | InMessageCodeCompletion;

export interface StliteWorker extends Worker {
  postMessage(message: InMessage, transfer: Transferable[]): void;
  postMessage(message: InMessage, options?: StructuredSerializeOptions): void;
}
export interface StliteMessagePort extends MessagePort {
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
    payload: ArrayBuffer | string;
  };
}
export interface OutMessageModuleAutoLoadEvent extends OutMessageBase {
  type: "event:moduleAutoLoad";
  data: {
    packagesToLoad: string[];
  };
}
export type OutMessage =
  | OutMessageStartEvent
  | OutMessageProgressEvent
  | OutMessageErrorEvent
  | OutMessageLoadedEvent
  | OutMessageWebSocketBack
  | OutMessageModuleAutoLoadEvent;

export interface ModuleAutoLoadMessageBase {
  type: string;
}
export interface ModuleAutoLoadSuccess extends ModuleAutoLoadMessageBase {
  type: "moduleAutoLoad:success";
  data: {
    loadedPackages: PackageData[];
  };
}
export interface ModuleAutoLoadError extends ModuleAutoLoadMessageBase {
  type: "moduleAutoLoad:error";
  error: Error;
}
export type ModuleAutoLoadMessage = ModuleAutoLoadSuccess | ModuleAutoLoadError;

/**
 * Reply message to InMessage
 */
interface ReplyMessageBase {
  type: string;
  error?: Error;
  data?: unknown;
}
export interface ReplyMessageHttpResponse extends ReplyMessageBase {
  type: "http:response";
  data: {
    response: HttpResponseInMessage;
  };
}
export interface ReplyMessageFileRead extends ReplyMessageBase {
  type: "reply:file:read";
  data: {
    content: string | Uint8Array;
  };
}

export interface LanguageServerCodeCompletionResponse {
  /**
   * Decided to use unknown to avoid importing whole package and bunch of stuff
   * from monaco-editor package that we don't need it here at all
   * https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.CompletionItem.html
   *
   */
  items: unknown[];
}
export interface ReplyMessageLanguageServerCodeCompletion
  extends ReplyMessageBase {
  type: "reply:language-server:code_completion";
  data: LanguageServerCodeCompletionResponse;
}
export interface ReplyMessageGeneralReply extends ReplyMessageBase {
  type: "reply";
  error?: Error;
}
export type ReplyMessage =
  | ReplyMessageHttpResponse
  | ReplyMessageFileRead
  | ReplyMessageLanguageServerCodeCompletion
  | ReplyMessageGeneralReply;

/**
 * Validators
 */
export function isPyodideConvertiblePrimitive(
  value: unknown,
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
        typeof key === "string" && isPyodideConvertiblePrimitive(value),
    )
  );
}
export function assertStreamlitConfig(
  value: unknown,
): asserts value is StreamlitConfig {
  if (!isStreamlitConfig(value)) {
    throw new Error(`Invalid streamlitConfig: ${value}`);
  }
}
