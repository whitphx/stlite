import type { PackageData } from "pyodide";
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";

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
export interface InstallMessage extends ForwardMessageBase {
  type: "install";
  data: {
    requirements: string[];
  };
}

export interface LanguageServerCodeCompletionRequestPayload {
  code: string;
  currentLine: string;
  currentLineNumber: number;
  offset: number;
}
export interface LanguageServerCodeCompletionMessage
  extends ForwardMessageBase {
  type: "language-server:code_completion";
  data: LanguageServerCodeCompletionRequestPayload;
}
export type ForwardMessage =
  | RebootMessage
  | FileWriteMessage
  | FileRenameMessage
  | FileUnlinkMessage
  | InstallMessage
  | LanguageServerCodeCompletionMessage;

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
export interface LanguageServerCodeCompletionResponse {
  items: languages.CompletionItem[];
}
export interface LanguageServerCodeCompletionReplyMessage
  extends ReplyMessageBase {
  type: "reply:language-server:code_completion";
  data: LanguageServerCodeCompletionResponse;
}

export type ReplyMessage =
  | GeneralReplyMessage
  | LanguageServerCodeCompletionReplyMessage;

/**
 * Messages from app to editor
 */
export interface BackwardMessageBase {
  type: string;
  data?: unknown;
  stlite: true; // To distinguish from other messages such as from the Streamlit app like https://github.com/streamlit/streamlit/blob/1.35.0/frontend/lib/src/hostComm/types.ts#L49
}
export interface ModuleAutoLoadSuccessMessage extends BackwardMessageBase {
  type: "moduleAutoLoadSuccess";
  data: {
    packagesToLoad: string[];
    loadedPackages: PackageData[];
  };
}

export type BackwardMessage = ModuleAutoLoadSuccessMessage;
