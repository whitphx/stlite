import { AppData } from "./proto/models";
import { u8aToBase64, base64ToU8A } from "./buffer";

// Conversion between base64 and base64url
// * https://gist.github.com/tomfordweb/bcb36baaa6db538b28d2f9a155debe0f
// * https://en.wikipedia.org/wiki/Base64
// * https://datatracker.ietf.org/doc/html/rfc4648#section-5
function b64ToB64url(base64: string): string {
  return base64.replace("+", "-").replace("/", "_").replace("=", ",");
}

function b64urlToB64(hashSafe: string): string {
  return hashSafe.replace("-", "+").replace("_", "/").replace(",", "=");
}

export function encodeAppData(appData: AppData): string {
  const encodedProto = AppData.encode(appData).finish();
  // NOTE: Both `u8aToBase64(encodedProto)` and `u8aToBase64(new Uint8Array(encodedProto))` causes an error: https://github.com/whitphx/stlite/issues/235
  //       Creating a new array buffer with `Uint8Array.from(encodedProto)` and passing it as below is necessary.
  //
  // `encodedProto` is NOT Uint8Array but Buffer, although it is typed as Uint8Array (we can find it by printing it with `console.log(encodedProto)`).
  // With respect to static typing, Buffer is a subtype of Uint8Array (https://github.com/protobufjs/protobuf.js/blob/48457c47372c39e07a8ecf1360f80de7f263ab2e/index.d.ts#L1850),
  // however, the implementations are different and it causes the problem at runtime.
  // Probably Buffer holds its raw binary data in its internals and only exposes some views of it.
  // This usually works well, but it becomes a problem when passed to a constructor of an array buffer view class like `Uint8Array`.
  // `new Uint8Array(buffer)` may provide the direct accessor to the underlying binary data in the original Buffer instance,
  // and the data read from the Uint8Array instance can differ from the one from the buffer.
  // So, we need to create a new array buffer with `Uint8Array.from()` sourced from the data read through the buffer interface here.
  const base64 = u8aToBase64(Uint8Array.from(encodedProto));
  return b64ToB64url(base64);
}

export function decodeAppData(base64url: string): AppData {
  const base64 = b64urlToB64(base64url);
  const buf = base64ToU8A(base64);
  return AppData.decode(buf);
}
