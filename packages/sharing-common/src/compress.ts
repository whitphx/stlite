import LZString from "lz-string"
import { EncodableAppData, EncodableFiles, EncodableFile } from "./models"

export function encodeAppData(appdata: EncodableAppData): string {
  // TODO: Encoder for Uint8Array
  return LZString.compressToEncodedURIComponent(JSON.stringify(appdata))
}

function isEncodableFile(maybeEncodableFile: any): maybeEncodableFile is EncodableFile {
  if (maybeEncodableFile == null) {
    return false;
  }
  if (!("type" in maybeEncodableFile) || !("data" in maybeEncodableFile)) {
    return false;
  }

  if (maybeEncodableFile["type"] === "text") {
    if (typeof maybeEncodableFile["data"] !== "string") {
      return false;
    }
  } else if (maybeEncodableFile["type"] === "uint8array") {
    if (!(maybeEncodableFile["data"] as unknown instanceof Uint8Array)) {
      return false;
    }
  }

  return true;
}

function isEncodableFiles(maybeEncodableFiles: any): maybeEncodableFiles is EncodableFiles {
  if (maybeEncodableFiles == null) {
    return false;
  }
  return Object.keys(maybeEncodableFiles).every(key => (key in maybeEncodableFiles) && isEncodableFile((maybeEncodableFiles as any)[key]))
}

function isEncodableAppData(maybeAppData: any): maybeAppData is EncodableAppData {
  if (maybeAppData == null) {
    return false;
  }
  if (!("entrypoint" in maybeAppData) || typeof maybeAppData["entrypoint"] !== "string") {
    return false;
  }
  if (!("files" in maybeAppData) || typeof maybeAppData["files"] !== "object") {
    return false;
  }
  if (!isEncodableFiles(maybeAppData["files"])) {
    return false;
  }
  if (!("requirements" in maybeAppData) || !Array.isArray(maybeAppData["requirements"])) {
    return false;
  }

  return true;
}

export function decodeAppData(encoded: string): EncodableAppData {
  const decompressed = LZString.decompressFromEncodedURIComponent(encoded)
  if (decompressed == null) {
    throw new Error("Failed to decompress")
  }
  const decoded = JSON.parse(decompressed)
  if (!isEncodableAppData(decoded)) {
    throw new Error(`Invalid data`)
  }

  return decoded;
}
