import { expect, test } from "vitest";
import { encodeAppData, decodeAppData } from "./compress";
import { AppData } from "./models";

function createDummyArrayBuffer(byteLength: number): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(byteLength);
  const bufferView = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteLength; ++i) {
    bufferView[i] = i;
  }
  return arrayBuffer;
}

test("encode and decode", () => {
  const appData: AppData = {
    entrypoint: "streamlit_app.py",
    files: {
      "streamlit_app.py": {
        type: "text",
        data: `
import streamlit as st

st.write("Hello World")`,
      },
      "foo.dat": {
        type: "arraybuffer",
        data: createDummyArrayBuffer(3), // Test with length that is neither multiple of 2 nor 4.
      },
    },
    requirements: ["opencv-python", "matplotlib"],
  };
  const encoded = encodeAppData(appData);
  const decoded = decodeAppData(encoded);

  expect(decoded).toEqual(appData);
});
