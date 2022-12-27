/**
 * Ad-hoc value that works at least on Chromium: 105.0.5195.102（Official Build） （arm64）.
 * Decrease this if `RangeError: Maximum call stack size exceeded` is reported.
 */
const DEFAULT_APPLY_MAX = 2 ** 16;

export function u8aToBase64(buf: Uint8Array, applyMax?: number): string {
  // If `buf` is too long, `String.fromCharCode.apply(null, buf)`
  // throws `RangeError: Maximum call stack size exceeded`,
  // so we split the buffer into chunks and process them one by one.
  let str = "";
  const nChunks = Math.ceil(buf.length / (applyMax ?? DEFAULT_APPLY_MAX));
  for (let i = 0; i < nChunks; ++i) {
    const offset = DEFAULT_APPLY_MAX * i;
    const chunk = buf.slice(offset, offset + DEFAULT_APPLY_MAX);
    str += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }

  return window.btoa(str);
}

export function base64ToU8A(base64: string): Uint8Array {
  const s = window.atob(base64);

  const len = s.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = s.charCodeAt(i);
  }
  return buf;
}
