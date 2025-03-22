import type { PackageData } from "pyodide";
import type { languages } from "monaco-editor";

/**
 * Messages from editor to app
 */
export interface ForwardMessageBase {
  type: string;
  data?: unknown;
}
export interface RebootMessage extends ForwardMessageBase {
  type: "reboot";
  data: {
    entrypoint: string;
  };
}
export interface FileWriteMessage extends ForwardMessageBase {
  type: "file:write";
  data: {
    path: string;
    content: string | Uint8Array;
  };
}
export interface FileRenameMessage extends ForwardMessageBase {
  type: "file:rename";
  data: {
    oldPath: string;
    newPath: string;
  };
}
export interface FileUnlinkMessage extends ForwardMessageBase {
  type: "file:unlink";
  data: {
    path: string;
  };
}
export interface FileReadMessage extends ForwardMessageBase {
  type: "file:read";
  data: {
    path: string;
  };
}
export interface InstallMessage extends ForwardMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}

export interface CodeCompletionRequest {
  code: string;
  line: number;
  column: number;
}
export interface CodeCompletionRequestMessage extends ForwardMessageBase {
  type: "code_completion_request";
  data: CodeCompletionRequest;
}
export type ForwardMessage =
  | RebootMessage
  | FileWriteMessage
  | FileRenameMessage
  | FileUnlinkMessage
  | FileReadMessage
  | InstallMessage
  | CodeCompletionRequestMessage;

/**
 * Reply to a forward message.
 */
export interface ReplyMessageBase {
  type: string;
  /** Some reply messages can contain data ex: code_completion, read_file
   */
  data?: unknown;
  error?: Error;
}

export interface GeneralReplyMessage extends ReplyMessageBase {
  type: "reply";
}

export interface FileReadResponse {
  content: string | Uint8Array;
}
export interface FileReadResponseMessage extends ReplyMessageBase {
  type: "reply:file:read";
  data: FileReadResponse;
}
export interface CodeCompletionResponse {
  items: languages.CompletionItem[];
}
export interface CodeCompletionResponseMessage extends ReplyMessageBase {
  type: "reply:code_completion_response";
  data: CodeCompletionResponse;
}

export type ReplyMessage =
  | GeneralReplyMessage
  | CodeCompletionResponseMessage
  | FileReadResponseMessage;

/**
 * Messages from app to editor
 */
export interface BackwardMessageBase {
  type: string;
  data?: unknown;
  stlite: true; // To distinguish from other messages such as from the Streamlit app like https://github.com/streamlit/streamlit/blob/1.35.0/frontend/lib/src/hostComm/types.ts#L49
}
export interface ModuleAutoLoadEventMessage extends BackwardMessageBase {
  type: "event:moduleAutoLoad";
  data: {
    packagesToLoad: string[];
    loadedPackages: PackageData[];
  };
}
export interface FileWriteEventMessage extends BackwardMessageBase {
  type: "event:file:write";
  data: {
    path: string;
  };
}
export interface FileRenameEventMessage extends BackwardMessageBase {
  type: "event:file:rename";
  data: {
    oldPath: string;
    newPath: string;
  };
}
export interface FileUnlinkEventMessage extends BackwardMessageBase {
  type: "event:file:unlink";
  data: {
    path: string;
  };
}

export type BackwardMessage =
  | ModuleAutoLoadEventMessage
  | FileWriteEventMessage
  | FileRenameEventMessage
  | FileUnlinkEventMessage;
