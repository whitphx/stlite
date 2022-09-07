import { expect, test } from "vitest";
import LZString from "lz-string";
import { ab2str, str2ab } from "./buffer";

function createDummyArrayBuffer(byteLength: number): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(byteLength);
  const bufferView = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteLength; ++i) {
    bufferView[i] = i;
  }
  return arrayBuffer;
}

[
  1,
  2,
  3,
  4,
  1000000, // Calling `String.fromCharCode.apply()` with a long buffer throws a RangeError.
].forEach((byteLength) => {
  test("encode and decode", () => {
    const data = createDummyArrayBuffer(byteLength);

    expect(str2ab(ab2str(data))).toEqual(data);
  });
});

[100, 1000000].forEach((byteLength) => {
  test("This design using .byteLength field is more efficient than using a boolean flag indicating padding", () => {
    const data = createDummyArrayBuffer(byteLength);

    const stringified = ab2str(data);

    const asis = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        s: stringified.str,
        p: stringified.byteLength,
      })
    );
    const alternative = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        s: stringified.str,
        p: byteLength % 2 === 1, // Use a boolean flag instead of byteLength to keep the information about the padding.
      })
    );

    expect(asis.length).toBeLessThan(alternative.length);
  });
});
