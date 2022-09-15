/**
 * Ad-hoc value that works at least on Chromium: 105.0.5195.102（Official Build） （arm64）.
 * Decrease this if `RangeError: Maximum call stack size exceeded` is reported.
 */
const DEFAULT_APPLY_MAX = 2 ** 16;

export function abTobase64(buf: ArrayBuffer, applyMax?: number): string {
  const bufView = new Uint8Array(buf);
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

  return window.btoa(str);
}

export function base64ToAb(base64: string): ArrayBuffer {
  const s = window.atob(base64);

  const len = s.length;
  const buf = new ArrayBuffer(len);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < len; i++) {
    bufView[i] = s.charCodeAt(i);
  }
  return buf;
}
