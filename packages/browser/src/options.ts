import type {
  StliteKernelOptions,
  EmscriptenFile,
  EmscriptenFileUrl,
} from "@stlite/kernel";
import type { MakeToastKernelCallbacksOptions } from "@stlite/common-react";

// Simplified version of StliteKernelOptions for the mount function.
// This is exposed to non-typed consumers of the mount function,
// so all fields are typed as optional.
export type SimplifiedStliteKernelOptions = Partial<{
  entrypoint: string;
  requirements: StliteKernelOptions["requirements"];
  prebuiltPackageNames: StliteKernelOptions["prebuiltPackageNames"];
  files: Record<
    string,
    EmscriptenFile | EmscriptenFileUrl | EmscriptenFile["data"] // EmscriptenFile["data"] is allowed as a shorthand for convenience.
  >;
  archives: StliteKernelOptions["archives"];
  installs: StliteKernelOptions["installs"];
  hostConfig: StliteKernelOptions["hostConfigResponse"];
  pyodideUrl: StliteKernelOptions["pyodideUrl"];
  wheelUrls: StliteKernelOptions["wheelUrls"];
  streamlitConfig: StliteKernelOptions["streamlitConfig"];
  idbfsMountpoints: StliteKernelOptions["idbfsMountpoints"];
  workerType: StliteKernelOptions["workerType"];
  sharedWorker: StliteKernelOptions["sharedWorker"];
  env: StliteKernelOptions["env"];
  languageServer: StliteKernelOptions["languageServer"];
}>;

function canonicalizeFiles(
  files: SimplifiedStliteKernelOptions["files"],
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
  archives: SimplifiedStliteKernelOptions["archives"],
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

export type DetailedMountOptions = SimplifiedStliteKernelOptions &
  MakeToastKernelCallbacksOptions;
export type MountOptions = string | DetailedMountOptions;

export function parseMountOptions(options: MountOptions): {
  kernelOptions: StliteKernelOptions;
  toastCallbackOptions: MakeToastKernelCallbacksOptions;
} {
  if (typeof options === "string") {
    const mainScript = options;
    return {
      kernelOptions: {
        entrypoint: DEFAULT_ENTRYPOINT,
        files: {
          [DEFAULT_ENTRYPOINT]: {
            data: mainScript,
          },
        },
        archives: [],
        requirements: [],
        prebuiltPackageNames: [],
      },
      toastCallbackOptions: {
        disableProgressToasts: false,
        disableErrorToasts: false,
      },
    };
  }

  const files = canonicalizeFiles(options.files);
  const archives = canonicalizeArchives(options.archives);

  // TODO: Validate the options object using superstruct.
  const entrypoint = options.entrypoint;
  if (entrypoint == null) {
    throw new Error("The `entrypoint` field is required.");
  }

  return {
    kernelOptions: {
      entrypoint,
      files,
      archives,
      requirements: options.requirements || [],
      prebuiltPackageNames: options.prebuiltPackageNames || [],
      hostConfigResponse: options.hostConfig,
      pyodideUrl: options.pyodideUrl,
      streamlitConfig: options.streamlitConfig,
      wheelUrls: options.wheelUrls,
      idbfsMountpoints: options.idbfsMountpoints,
      workerType: options.workerType,
      sharedWorker: options.sharedWorker,
      env: options.env,
      languageServer: options.languageServer,
    },
    toastCallbackOptions: {
      disableProgressToasts: options.disableProgressToasts || false,
      disableErrorToasts: options.disableErrorToasts || false,
    },
  };
}
