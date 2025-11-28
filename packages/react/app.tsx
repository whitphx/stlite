import React from "react";
import { createRoot } from "react-dom/client";
import { StliteApp, createKernel } from "./src/index";
import { wheelUrls } from "./src/wheels";
import type { StliteKernelOptions } from "@stlite/kernel";
import workerUrl from "@stlite/kernel/worker?url";

const kernelOptions: StliteKernelOptions = {
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.title("Hello, stlite!")
st.write("This is a Streamlit app running entirely in your browser using WebAssembly and Pyodide.")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
  worker: {
    url: new URL(workerUrl, import.meta.url),
  },
};

const kernel = createKernel(kernelOptions);

const reactRoot = createRoot(document.getElementById("root") as HTMLElement);

reactRoot.render(
  <React.StrictMode>
    <StliteApp kernel={kernel} />
  </React.StrictMode>,
);
