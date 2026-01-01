import React from "react";
import { createRoot } from "react-dom/client";
import { StliteApp, createKernel } from "./src/index";
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
        <StliteApp kernel={kernel1} />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteApp kernel={kernel2} />
      </div>
    </div>
  </React.StrictMode>,
);
