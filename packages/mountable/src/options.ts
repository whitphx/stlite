import { StliteKernelOptions } from "@stlite/stlite-kernel";

type SimplifiedFiles = Record<string, string | ArrayBufferView>;
export interface SimplifiedStliteKernelOptions
  extends Omit<StliteKernelOptions, "command" | "entrypoint" | "files"> {
  entrypoint?: string;
  requirements?: StliteKernelOptions["requirements"];
  files?: StliteKernelOptions["files"] | SimplifiedFiles;
  hello?: boolean;
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
    if (typeof value === "object" && "data" in value) {
      canonicalFiles[key] = value;
    } else {
      canonicalFiles[key] = {
        data: value,
      };
    }
  });
  return canonicalFiles;
}

const DEFAULT_ENTRYPOINT = "streamlit_app.py";

export type MountOptions = string | SimplifiedStliteKernelOptions;

export function canonicalizeOptions(options: string | SimplifiedStliteKernelOptions): StliteKernelOptions {
  if (typeof options === "string") {
    const mainScript = options;
    const entrypoint = "streamlit_app.py";
    return {
      command: "run",
      entrypoint,
      files: {
        [entrypoint]: {
          data: mainScript,
        },
      },
    }
  }

  const files = canonicalizeFiles(options.files);

  return {
    ...options,
    command: options.hello ? "hello" : "run",
    entrypoint: options.entrypoint || DEFAULT_ENTRYPOINT,
    files,
  };
}
