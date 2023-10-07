import type {
  StliteKernelOptions,
  EmscriptenFile,
  EmscriptenFileUrl,
} from "@stlite/kernel";
import { makeToastKernelCallbacks } from "@stlite/common-react";

export interface SimplifiedStliteKernelOptions {
  entrypoint?: string;
  requirements?: StliteKernelOptions["requirements"];
  files?: Record<
    string,
    EmscriptenFile | EmscriptenFileUrl | EmscriptenFile["data"] // EmscriptenFile["data"] is allowed as a shorthand for convenience.
  >;
  archives?: StliteKernelOptions["archives"];
  allowedOriginsResp?: StliteKernelOptions["allowedOriginsResp"];
  pyodideUrl?: StliteKernelOptions["pyodideUrl"];
  streamlitConfig?: StliteKernelOptions["streamlitConfig"];
  // We won't add onProgress and onLoad callbacks until they are required by some users to keep the API simple.
  onError?: (
    ...args: Parameters<NonNullable<StliteKernelOptions["onError"]>>
  ) => boolean | void;
}

function canonicalizeFiles(
  files: SimplifiedStliteKernelOptions["files"]
): NonNullable<StliteKernelOptions["files"]> {
  if (files == null) {
    return {};
  }

  const canonicalFiles: StliteKernelOptions["files"] = {};
  Object.keys(files).forEach((key) => {
    const value = files[key];
    if (typeof value === "string" || ArrayBuffer.isView(value)) {
      canonicalFiles[key] = {
        data: value,
      };
      return;
    }
    if (typeof value === "object") {
      if ("data" in value) {
        canonicalFiles[key] = value;
        return;
      } else if ("url" in value) {
        canonicalFiles[key] = {
          ...value,
          url: resolveUrl(value.url),
        };
        return;
      }
    }
    throw new Error(`Invalid file value: ${value}`);
  });
  return canonicalFiles;
}

export function resolveUrl(url: string): string {
  return new URL(url, window.location.href).href;
}

function canonicalizeArchives(
  archives: SimplifiedStliteKernelOptions["archives"]
): StliteKernelOptions["archives"] {
  if (archives == null) {
    return [];
  }

  return archives.map((archive) => {
    if ("buffer" in archive) {
      return archive;
    }

    // Resolve relative URLs before passing to the worker because the base URL is different in the worker.
    return {
      ...archive,
      url: resolveUrl(archive.url),
    };
  });
}

const DEFAULT_ENTRYPOINT = "streamlit_app.py";

export type MountOptions = string | SimplifiedStliteKernelOptions;

export function canonicalizeMountOptions(
  options: string | SimplifiedStliteKernelOptions
): StliteKernelOptions {
  const toastCallbacks = makeToastKernelCallbacks();

  if (typeof options === "string") {
    const mainScript = options;
    return {
      entrypoint: DEFAULT_ENTRYPOINT,
      files: {
        [DEFAULT_ENTRYPOINT]: {
          data: mainScript,
        },
      },
      archives: [],
      requirements: [],
      ...toastCallbacks,
    };
  }

  const files = canonicalizeFiles(options.files);
  const archives = canonicalizeArchives(options.archives);

  const onErrorOption = options.onError;
  const onError: StliteKernelOptions["onError"] = onErrorOption
    ? (...args) => {
        const shouldShowToast = onErrorOption(...args);
        if (shouldShowToast !== false) {
          toastCallbacks.onError(...args);
        }
      }
    : toastCallbacks.onError;

  return {
    entrypoint: options.entrypoint || DEFAULT_ENTRYPOINT,
    files,
    archives,
    requirements: options.requirements || [],
    allowedOriginsResp: options.allowedOriginsResp,
    pyodideUrl: options.pyodideUrl,
    streamlitConfig: options.streamlitConfig,
    ...toastCallbacks,
    onError,
  };
}
