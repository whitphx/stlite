import type { PackageData } from "pyodide";

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
export type ForwardMessage =
  | RebootMessage
  | FileWriteMessage
  | FileRenameMessage
  | FileUnlinkMessage
  | InstallMessage;

/**
 * Reply to a forward message.
 */
export interface ReplyMessage {
  type: "reply";
  error?: Error;
}

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
