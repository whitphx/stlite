import { StliteKernelOptions } from "@stlite/kernel";

type SimplifiedFiles = Record<string, string | ArrayBufferView>;
export interface SimplifiedStliteKernelOptions {
  entrypoint?: string;
  requirements?: StliteKernelOptions["requirements"];
  files?: StliteKernelOptions["files"] | SimplifiedFiles;
  allowedOriginsResp?: StliteKernelOptions["allowedOriginsResp"];
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

export function canonicalizeMountOptions(
  options: string | SimplifiedStliteKernelOptions
): StliteKernelOptions {
  if (typeof options === "string") {
    const mainScript = options;
    return {
      entrypoint: DEFAULT_ENTRYPOINT,
      files: {
        [DEFAULT_ENTRYPOINT]: {
          data: mainScript,
        },
      },
      requirements: [],
    };
  }

  const files = canonicalizeFiles(options.files);

  return {
    entrypoint: options.entrypoint || DEFAULT_ENTRYPOINT,
    files,
    requirements: options.requirements || [],
    allowedOriginsResp: options.allowedOriginsResp,
  };
}
