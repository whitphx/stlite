import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";

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

export function App() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", gap: 16 }}>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel1} mountDocumentStyles={false} />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel2} mountDocumentStyles={false} />
      </div>
    </div>
  );
}
