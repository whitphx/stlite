import { expect, test } from "vitest";
import { encodeAppData, decodeAppData } from "./compress";
import { AppData } from "./proto/models";

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
        content: {
          $case: "text",
          text: `
import streamlit as st

st.write("Hello World")`,
        },
      },
      "foo.dat": {
        content: {
          $case: "data",
          data: new Uint8Array(createDummyArrayBuffer(3)), // Test with length that is neither multiple of 2 nor 4.
        },
      },
    },
    requirements: ["opencv-python", "matplotlib"],
  };
  const encoded = encodeAppData(appData);
  const decoded = decodeAppData(encoded);

  expect(decoded).toEqual(appData);
});

test("encode and decode (an edge case of https://github.com/whitphx/stlite/issues/235)", () => {
  const logoDataUri =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgICAgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAsIDAsIDYwMCwgNjAwIiA+CgogIDwhLS0gSWNvbjogNjAweDYwMCwgcm90YXRlZCAtLT4KICA8ZyB0cmFuc2Zvcm09InJvdGF0ZSgyMCwgMzAwLCAzMDApIj4KICAgIDxyZWN0IHJ4PSIyMCIgcnk9IjIwIiBmaWxsPSJyZ2IoMTczLCA3NCwgODIpIiB4PSIzMDAiIHdpZHRoPSIyNTAiIHk9IjIwMCIgaGVpZ2h0PSIyMDAiIC8+CiAgICA8cmVjdCByeD0iMjAiIHJ5PSIyMCIgZmlsbD0icmdiKDI0NCwgNzUsIDc1KSIgeD0iMTgwIiB3aWR0aD0iMjQwIiB5PSIxMDAiIGhlaWdodD0iNDAwIiAvPgogICAgPHJlY3Qgcng9IjIwIiByeT0iMjAiIGZpbGw9InJnYigyNTUsIDEyNywgMTI3KSIgeD0iNTAiIHdpZHRoPSIyNTAiIHk9IjIwMCIgaGVpZ2h0PSIyMDAiIC8+CiAgPC9nPgo8L3N2Zz4K";

  // Ref: https://stackoverflow.com/a/7261048/13103190
  const byteString = atob(logoDataUri.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const appData: AppData = {
    entrypoint: "",
    requirements: [],
    files: {
      "data/logo.svg": {
        content: {
          $case: "data",
          data: ia,
        },
      },
    },
  };
  const encoded = encodeAppData(appData);
  const decoded = decodeAppData(encoded);

  expect(decoded).toEqual(appData);
});
