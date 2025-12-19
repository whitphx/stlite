import React from "react";
import { createRoot } from "react-dom/client";
import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";
import "@stlite/react/stlite.css";

const kernel = createKernel({
  entrypoint: "streamlit_app.py",
  files: {
    "streamlit_app.py": {
      data: `
import streamlit as st

st.write("Hello from Stlite + React!")
`,
    },
  },
  archives: [],
  requirements: [],
  prebuiltPackageNames: [],
  wheelUrls,
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StliteAppWithToast kernel={kernel} />
    {/* <StliteApp kernel={kernel} /> // For non-toast version */}
  </React.StrictMode>,
);
