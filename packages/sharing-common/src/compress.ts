import LZString from "lz-string";
import {
  AppData,
  TypedFiles,
  LZStringCompressableAppData,
  LZStringCompressableFiles,
  LZStringCompressableFile,
  LZStringCompressableFileArrayBuffer,
  K_TYPE,
  K_DATA,
  K_BYTELENGTH,
  K_FILES,
  K_ENTRYPOINT,
  K_REQUIREMENTS,
} from "./models";
import { ab2str, str2ab } from "./buffer";

function stringifyFiles(files: TypedFiles): LZStringCompressableFiles {
  const stringifiedFiles: LZStringCompressableFiles = {};
  Object.keys(files).forEach((key) => {
    const value = files[key];
    if (value.type === "text") {
      stringifiedFiles[key] = {
        [K_TYPE]: "t",
        [K_DATA]: value.data,
      };
    } else if (value.type === "arraybuffer") {
      const stringified = ab2str(value.data);
      stringifiedFiles[key] = {
        [K_TYPE]: "a",
        [K_DATA]: stringified.str,
        [K_BYTELENGTH]: stringified.byteLength,
      };
    } else {
      throw new Error(`Unexpected file type: "${value["type"]}"`);
    }
  });

  return stringifiedFiles;
}

export function encodeAppData(appdata: AppData): string {
  const jsonableData: LZStringCompressableAppData = {
    [K_ENTRYPOINT]: appdata.entrypoint,
    [K_REQUIREMENTS]: appdata.requirements,
    [K_FILES]: stringifyFiles(appdata.files),
  };

  // NOTE: URL fragment allows more characters than the URL-safe characters
  // (see https://stackoverflow.com/questions/26088849/url-fragment-allowed-characters)
  // so theoretically we can improve the compression efficiency here
  // as long as we use the compressed string in the URL fragments.
  // However, LZString does not expose such an API through which we can inject
  // a customized character set,
  // so we use compressToEncodedURIComponent() as the second best.
  return LZString.compressToEncodedURIComponent(JSON.stringify(jsonableData));
}

function isLZStringCompressableFile(
  maybe: any
): maybe is LZStringCompressableFile {
  if (maybe == null) {
    return false;
  }

  if (
    maybe[K_TYPE] !== "t" /* text */ &&
    maybe[K_TYPE] !== "a" /* arraybuffer */
  ) {
    return false;
  }

  if (typeof maybe[K_DATA] !== "string") {
    return false;
  }

  if (
    maybe[K_TYPE] === "a" /* arraybuffer */ &&
    typeof maybe[K_BYTELENGTH] !== "number"
  ) {
    return false;
  }

  return true;
}

function isLZStringCompressableFiles(
  maybe: any
): maybe is LZStringCompressableFiles {
  if (maybe == null) {
    return false;
  }
  return Object.keys(maybe).every((key) =>
    isLZStringCompressableFile(maybe[key])
  );
}

function isLZStringCompressableAppData(
  maybe: any
): maybe is LZStringCompressableAppData {
  if (maybe == null) {
    return false;
  }
  if (!(K_ENTRYPOINT in maybe) || typeof maybe[K_ENTRYPOINT] !== "string") {
    return false;
  }
  if (!(K_FILES in maybe) || typeof maybe[K_FILES] !== "object") {
    return false;
  }
  if (!isLZStringCompressableFiles(maybe[K_FILES])) {
    return false;
  }
  if (
    !(K_REQUIREMENTS in maybe) ||
    !Array.isArray(maybe[K_REQUIREMENTS]) ||
    maybe[K_REQUIREMENTS].some((r: unknown) => typeof r !== "string")
  ) {
    return false;
  }

  return true;
}

function unstringifyFiles(files: LZStringCompressableFiles): TypedFiles {
  const typedFiles: TypedFiles = {};
  Object.keys(files).forEach((key) => {
    const value = files[key];
    if (value[K_TYPE] === "t") {
      // text
      typedFiles[key] = {
        type: "text",
        data: value[K_DATA],
      };
    } else if (value[K_TYPE] === "a") {
      // arraybuffer
      typedFiles[key] = {
        type: "arraybuffer",
        data: str2ab({
          str: value[K_DATA],
          byteLength: (value as LZStringCompressableFileArrayBuffer)[ // Casting here is required somehow.
            K_BYTELENGTH
          ],
        }),
      };
    } else {
      throw new Error(`Unexpected file type: "${value[K_TYPE]}"`);
    }
  });

  return typedFiles;
}

export function decodeAppData(encoded: string): AppData {
  const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
  if (decompressed == null) {
    throw new Error("Failed to decompress");
  }
  const decoded = JSON.parse(decompressed);
  if (!isLZStringCompressableAppData(decoded)) {
    console.log("Invalid data", decoded);
    throw new Error(`Invalid data`);
  }

  return {
    entrypoint: decoded[K_ENTRYPOINT],
    requirements: decoded[K_REQUIREMENTS],
    files: unstringifyFiles(decoded[K_FILES]),
  };
}
