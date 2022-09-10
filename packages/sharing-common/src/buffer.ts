// Conversion between string and ArrayBuffer.
// Ref: https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/

interface StringifiedArrayBuffer {
  str: string;
  padded: boolean;
}

/**
 * Ad-hoc value that works at least on Chromium: 105.0.5195.102（Official Build） （arm64）.
 * Decrease this if `RangeError: Maximum call stack size exceeded` is reported.
 */
const DEFAULT_APPLY_MAX = 2 ** 16;

export function ab2str(
  buf: ArrayBuffer,
  applyMax?: number
): StringifiedArrayBuffer {
  if (buf.byteLength % 2 !== 0) {
    // Uint16Array only accepts ArrayBuffer whose length is a multiple of 2,
    // so pad zero at the last 1 byte if the buffer does not meet this requirement.
    // We can avoid this problem by using Uint8Array instead,
    // however, Uint16Array is DOUBLE efficient than Uint8Array,
    // so we prefer Uint16Array with this hack.
    // Due to this padding, the additional info `.padded` is needed at the decoding time.
    const padded = new ArrayBuffer(buf.byteLength + 1);
    const paddedBufView = new Uint8Array(padded);
    paddedBufView.set(new Uint8Array(buf), 0);

    const stringified = ab2str(padded);
    stringified.padded = true;
    return stringified;
  }

  // String is represented in UTF-16, so we use Uint16Array as an encoder.
  // See https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
  const bufView = new Uint16Array(buf);

  // If `bufView` is too long, `String.fromCharCode.apply(null, bufView)`
  // throws `RangeError: Maximum call stack size exceeded`,
  // so we split the buffer into chunks and process them one by one.
  let str = "";
  const nChunks = Math.ceil(bufView.length / (applyMax ?? DEFAULT_APPLY_MAX));
  for (let i = 0; i < nChunks; ++i) {
    const offset = DEFAULT_APPLY_MAX * i;
    const chunk = bufView.slice(offset, offset + DEFAULT_APPLY_MAX);
    str += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return {
    str,
    padded: false,
  };
}

export function str2ab(stringified: StringifiedArrayBuffer) {
  const str = stringified.str;

  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  if (stringified.padded) {
    return buf.slice(0, -1);
  } else {
    return buf;
  }
}
