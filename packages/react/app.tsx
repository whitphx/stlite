import React from "react";
import { createRoot } from "react-dom/client";
import { StliteAppWithToast, createKernel } from "./src/index";
import { wheelUrls } from "./src/vite-utils";

const kernel1 = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.write("Hello, stlite!")
st.write("App 1")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
});
const kernel2 = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.write("Hello, stlite!")
st.write("App 2")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
});

const reactRoot = createRoot(document.getElementById("root") as HTMLElement);

reactRoot.render(
  <React.StrictMode>
    <div style={{ width: "100%", height: "100%", display: "flex", gap: 16 }}>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel1} mountDocumentStyles={false} />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel2} mountDocumentStyles={false} />
      </div>
    </div>
  </React.StrictMode>,
);
