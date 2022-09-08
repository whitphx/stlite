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
  3, // Not a multiple of 2: A special care is needed for Uint16Array.
  4,
  5, // A number exceeding a minimum byteLength of Uint32Array is also tested tentatively.
  1000000, // Calling `String.fromCharCode.apply()` with a long buffer throws a RangeError.
].forEach((byteLength) => {
  test(`encode and decode an array buffer whose length is ${byteLength}`, () => {
    const data = createDummyArrayBuffer(byteLength);

    expect(str2ab(ab2str(data))).toEqual(data);
  });
});

[3, 4].forEach((byteLength) => {
  const applyMax = 3;
  test(`encoder with an input longer than or equal (${byteLength}) applyMax (${applyMax})`, () => {
    const data = createDummyArrayBuffer(byteLength);
    expect(str2ab(ab2str(data, applyMax))).toEqual(data);
  });
});

[100, 1000000].forEach((byteLength) => {
  test("The current design using .byteLength is more efficient than using a boolean flag indicating padding", () => {
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
