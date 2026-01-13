import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";

// Create kernels with sharedWorker: true to share a single worker between apps.
// This reduces memory usage when running multiple apps on the same page.
// Note: SharedWorker shares the Python runtime, but each app has its own
// independent session state. Data is NOT shared between apps.
// Note: SharedWorker is not supported in all browsers (e.g., Chrome Android).
const kernel1 = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.write("Hello, stlite!")
st.write("Shared Worker App 1")

if "counter" not in st.session_state:
    st.session_state.counter = 0

if st.button("Increment counter"):
    st.session_state.counter += 1

st.write(f"Counter: {st.session_state.counter}")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
  sharedWorker: true,
});
const kernel2 = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.write("Hello, stlite!")
st.write("Shared Worker App 2")

if "counter" not in st.session_state:
    st.session_state.counter = 0

if st.button("Increment counter"):
    st.session_state.counter += 1

st.write(f"Counter: {st.session_state.counter}")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
  sharedWorker: true,
});

export function App() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", gap: 16 }}>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel1} disableDocumentStyles />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel2} disableDocumentStyles />
      </div>
    </div>
  );
}
