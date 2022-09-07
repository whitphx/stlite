import LZString from "lz-string"
import { AppData, TypedFiles, LZStringCompressableAppData, LZStringCompressableFiles, LZStringCompressableFile, ALIAS_TYPE, ALIAS_DATA, ALIAS_BYTELENGTH } from "./models"
import { ab2str, str2ab } from "./buffer"

function stringifyFiles(files: TypedFiles): LZStringCompressableFiles {
  const stringifiedFiles: LZStringCompressableFiles = {}
  Object.keys(files).forEach((key) => {
    const value = files[key];
    if (value.type === "text") {
      stringifiedFiles[key] = {
        [ALIAS_TYPE]: "text",
        [ALIAS_DATA]: value.data,
      };
    } else if (value.type === "arraybuffer") {
      const stringified = ab2str(value.data);
      stringifiedFiles[key] = {
        [ALIAS_TYPE]: "arraybuffer",
        [ALIAS_DATA]: stringified.str,
        [ALIAS_BYTELENGTH]: stringified.byteLength,
      };
    } else {
      throw new Error(`Unexpected file type: "${value['type']}"`)
    }
  })

  return stringifiedFiles
}

export function encodeAppData(appdata: AppData): string {
  const jsonableData = {
    ...appdata,
    files: stringifyFiles(appdata.files),
  }
  return LZString.compressToEncodedURIComponent(JSON.stringify(jsonableData))
}

function isLZStringCompressableFile(maybe: any): maybe is LZStringCompressableFile {
  if (maybe == null) {
    return false;
  }

  if (maybe[ALIAS_TYPE] !== "text" && maybe[ALIAS_TYPE] !== "arraybuffer") {
    return false;
  }

  if (typeof maybe[ALIAS_DATA] !== "string") {
    return false;
  }

  if (maybe[ALIAS_TYPE] === "arraybuffer" && typeof maybe[ALIAS_BYTELENGTH] !== "number") {
    return false;
  }

  return true;
}

function isLZStringCompressableFiles(maybe: any): maybe is LZStringCompressableFiles {
  if (maybe == null) {
    return false;
  }
  return Object.keys(maybe).every(key => (key in maybe) && isLZStringCompressableFile((maybe as any)[key]))
}

function isLZStringCompressableAppData(maybe: any): maybe is LZStringCompressableAppData {
  if (maybe == null) {
    return false;
  }
  if (!("entrypoint" in maybe) || typeof maybe["entrypoint"] !== "string") {
    return false;
  }
  if (!("files" in maybe) || typeof maybe["files"] !== "object") {
    return false;
  }
  if (!isLZStringCompressableFiles(maybe["files"])) {
    return false;
  }
  if (!("requirements" in maybe) || !Array.isArray(maybe["requirements"])) {
    return false;
  }

  return true;
}

function unstringifyFiles(files: LZStringCompressableFiles): TypedFiles {
  const encodableFiles: TypedFiles = {};
  Object.keys(files).forEach((key) => {
    const value = files[key];
    if (value[ALIAS_TYPE] === "text") {
      encodableFiles[key] = {
        type: "text",
        data: value[ALIAS_DATA],
      };
    } else if (value[ALIAS_TYPE] === "arraybuffer") {
      encodableFiles[key] = {
        type: "arraybuffer",
        data: str2ab({ str: value[ALIAS_DATA], byteLength: value[ALIAS_BYTELENGTH] }),
      };
    } else {
      throw new Error(`Unexpected file type: "${value[ALIAS_TYPE]}"`)
    }
  })

  return encodableFiles;
}

export function decodeAppData(encoded: string): AppData {
  const decompressed = LZString.decompressFromEncodedURIComponent(encoded)
  if (decompressed == null) {
    throw new Error("Failed to decompress")
  }
  const decoded = JSON.parse(decompressed)
  if (!isLZStringCompressableAppData(decoded)) {
    throw new Error(`Invalid data`)
  }

  return {
    ...decoded,
    files: unstringifyFiles(decoded.files)
  };
}
