import { expect, test } from "vitest";
import { u8aToBase64, base64ToU8A } from "./buffer";

function createDummyUint8Array(byteLength: number): Uint8Array {
  const buf = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; ++i) {
    buf[i] = i;
  }
  return buf;
}

test("vitest matcher for Uint8Array", () => {
  const u8a1 = new Uint8Array([1, 2, 3, 4]);
  const u8a2 = new Uint8Array([1, 2, 3, 4]);
  const u8a3 = new Uint8Array([5, 6, 7, 8]);

  // The following matchers work as expected for Uint8Array.
  // Note that these are not in the case of ArrayBuffer; See https://github.com/whitphx/stlite/blob/51476c3c49de11b937445477dc437e4078d97d36/packages/sharing-common/src/buffer.test.ts#L20-L28
  expect(u8a1).toEqual(u8a2);
  expect(u8a1).not.toEqual(u8a3);
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
    const data = createDummyUint8Array(byteLength);
    const encDeced = base64ToU8A(u8aToBase64(data));
    expect(encDeced).toEqual(data);
  });
});

[3, 4].forEach((byteLength) => {
  const applyMax = 3;
  test(`encoder with an input longer than or equal (${byteLength}) applyMax (${applyMax})`, () => {
    const data = createDummyUint8Array(byteLength);
    const encDeced = base64ToU8A(u8aToBase64(data, applyMax));
    expect(encDeced).toEqual(data);
  });
});
