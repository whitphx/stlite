import LZString from "lz-string";
import { AppData } from "./proto/models";
import { ab2str, str2ab } from "./buffer";

export function encodeAppData(appData: AppData): string {
  const encodedProto = AppData.encode(appData).finish();
  const { str, padded } = ab2str(encodedProto);
  const prefix = padded ? "1" : "0";
  return prefix + LZString.compressToEncodedURIComponent(str);
}

export function decodeAppData(urlString: string): AppData {
  const prefix = urlString.slice(0, 1);
  const compressedString = urlString.slice(1);

  if (prefix !== "0" && prefix !== "1") {
    throw new Error(`Invalid prefix: "${prefix}"`);
  }

  const padded = prefix === "1" ? true : false;
  const decompressed =
    LZString.decompressFromEncodedURIComponent(compressedString);
  if (decompressed == null) {
    throw new Error("Failed to decompress");
  }

  const encodedProto = str2ab({ str: decompressed, padded });
  return AppData.decode(new Uint8Array(encodedProto));
}
