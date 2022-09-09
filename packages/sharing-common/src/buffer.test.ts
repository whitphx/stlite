import { expect, test } from "vitest";
import { ab2str, str2ab } from "./buffer";

function createDummyArrayBuffer(byteLength: number): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(byteLength);
  const bufferView = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteLength; ++i) {
    bufferView[i] = i;
  }
  return arrayBuffer;
}

test("vitest matcher for ArrayBuffer", () => {
  const ab1 = new ArrayBuffer(4);
  new Uint8Array(ab1).set([1, 2, 3, 4]);
  const ab2 = new ArrayBuffer(4);
  new Uint8Array(ab2).set([1, 2, 3, 4]);
  const ab3 = new ArrayBuffer(4);
  new Uint8Array(ab3).set([5, 6, 7, 8]);

  expect(new Uint8Array(ab1)).toEqual(new Uint8Array(ab2));
  expect(new Uint8Array(ab1)).not.toEqual(new Uint8Array(ab3));
  // NOTE: ArrayBuffer values have to be tested by using ArrayBufferView classes
  // unlike the following commented-out examples
  // as ArrayBuffer does not provide the way to access its values.
  //
  // expect(ab1).toEqual(ab2)
  // expect(ab1).not.toEqual(ab3)  // This is expected to fail, but actually passes.
});

[
  1,
  2,
  3, // Not a multiple of 2: A special care is needed for Uint16Array.
  4,
  5, // A number exceeding a minimum byteLength of Uint32Array is also tested tentatively.
  0xffff - 1, // The last byte would be filled with 1 at almost every bit (0b1111111111111110)
  0xffff - 2,
  0xffff - 3,
  0xffff - 4,
  0xffff - 5,
  1000000, // Calling `String.fromCharCode.apply()` with a long buffer throws a RangeError.
].forEach((byteLength) => {
  test(`encode and decode an array buffer whose length is ${byteLength}`, () => {
    const data = createDummyArrayBuffer(byteLength);
    const encDeced = str2ab(ab2str(data));
    expect(new Uint8Array(encDeced)).toEqual(new Uint8Array(data));
  });
});

[3, 4].forEach((byteLength) => {
  const applyMax = 3;
  test(`encoder with an input longer than or equal (${byteLength}) applyMax (${applyMax})`, () => {
    const data = createDummyArrayBuffer(byteLength);
    const encDeced = str2ab(ab2str(data, applyMax));
    expect(new Uint8Array(encDeced)).toEqual(new Uint8Array(data));
  });
});
