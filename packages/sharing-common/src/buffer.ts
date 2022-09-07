// Conversion between string and ArrayBuffer.
// Ref: https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/

interface StringifiedArrayBuffer {
  str: string;
  byteLength: number;
}

/**
 * Ad-hoc value that works at least for NodeJS v16.13.0 (arm64).
 * Decrease this if `RangeError: Maximum call stack size exceeded` is reported.
 */
const APPLY_MAX = 2 ** 18;

export function ab2str(buf: ArrayBuffer): StringifiedArrayBuffer {
  if (buf.byteLength % 2 !== 0) {
    // Uint16Array only accepts ArrayBuffer whose length is a multiple of 2,
    // so pad zero at the last 1 byte if the buffer does not meet this requirement.
    // We can avoid this problem by using Uint8Array instead,
    // however, Uint16Array is DOUBLE efficient than Uint8Array,
    // so we prefer Uint16Array with this hack.
    // Due to this padding, the additional info `.byteLength` is needed at the decoding time.
    //
    // NOTE: There is another option to tell the decoder the original buffer length
    // that is passing a boolean flag indicating whether the padding has occurred.
    // However, according to an experiment, using a number value of `.byteLength`
    // is more efficient for the combination of `JSON.stringify` and `LZString.compressToEncodedURIComponent`.
    // This is because a boolean value is encoded to a string such as "true" and "false"
    // which are usually longer and less compression-efficient than string expressions of numbers such as "100".
    const padded = new ArrayBuffer(buf.byteLength + 1);
    const paddedBufView = new Uint8Array(padded);
    paddedBufView.set(new Uint8Array(buf));
    paddedBufView[buf.byteLength - 2] = 0; // Pad

    const stringified = ab2str(padded);
    stringified.byteLength = buf.byteLength;
    return stringified;
  }

  const bufView = new Uint16Array(buf);

  // If `bufView` is too long, `String.fromCharCode.apply(null, bufView)`
  // throws `RangeError: Maximum call stack size exceeded`,
  // so we split the buffer into chunks and process them one by one.
  let str = "";
  const nChunks = bufView.length / APPLY_MAX;
  for (let i = 0; i < nChunks; ++i) {
    const offset = APPLY_MAX * i;
    str += String.fromCharCode.apply(
      null,
      bufView.slice(offset, offset + APPLY_MAX) as unknown as number[]
    );
  }
  return {
    str,
    byteLength: buf.byteLength,
  };
}

export function str2ab(stringified: StringifiedArrayBuffer) {
  const str = stringified.str;

  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf.slice(0, stringified.byteLength);
}
