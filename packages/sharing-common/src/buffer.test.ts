import { expect, test } from "vitest";
import { abTobase64, base64ToAb } from "./buffer";

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
  3,
  4,
  5,
  1000000, // Calling `String.fromCharCode.apply()` with a long buffer throws a RangeError.
].forEach((byteLength) => {
  test(`encode and decode an array buffer whose length is ${byteLength}`, () => {
    const data = createDummyArrayBuffer(byteLength);
    const encDeced = base64ToAb(abTobase64(data));
    expect(new Uint8Array(encDeced)).toEqual(new Uint8Array(data));
  });
});

[3, 4].forEach((byteLength) => {
  const applyMax = 3;
  test(`encoder with an input longer than or equal (${byteLength}) applyMax (${applyMax})`, () => {
    const data = createDummyArrayBuffer(byteLength);
    const encDeced = base64ToAb(abTobase64(data, applyMax));
    expect(new Uint8Array(encDeced)).toEqual(new Uint8Array(data));
  });
});
