import LZString from "lz-string";
import { AppData } from "./proto/models";
import { ab2str, str2ab } from "./buffer";

export function encodeAppData(appData: AppData): string {
  const encodedProto = AppData.encode(appData).finish();
  // NOTE: Both `ab2str(encodedProto)` and `ab2str(new Uint8Array(encodedProto))` causes an error: https://github.com/whitphx/stlite/issues/235
  //       Creating a new array buffer with `Uint8Array.from(encodedProto).buffer` and passing it as below is necessary.
  //
  // `encodedProto` is NOT Uint8Array but Buffer, although it is typed as Uint8Array (we can find it by printing it with `console.log(encodedProto)`).
  // With respect to static typing, Buffer is a subtype of Uint8Array (https://github.com/protobufjs/protobuf.js/blob/48457c47372c39e07a8ecf1360f80de7f263ab2e/index.d.ts#L1850),
  // however, the implementations are different and it causes the problem at runtime.
  // Probably Buffer holds its raw binary data in its internals and only exposes some views of it.
  // This usually works well, but it becomes a problem when passed to a constructor of an array buffer view class like `Uint8Array`.
  // `new Uint8Array(buffer)` may provide the direct accessor to the underlying binary data in the original Buffer instance,
  // and the data read from the Uint8Array instance can differ from the one from the buffer.
  // So, we need to create a new array buffer with `Uint8Array.from()` sourced from the data read through the buffer interface here.
  const { str, padded } = ab2str(Uint8Array.from(encodedProto).buffer);
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
