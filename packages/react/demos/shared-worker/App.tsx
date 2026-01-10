import { StliteAppWithToast, createKernel } from "../../src/index";
import { wheelUrls } from "../../src/vite-utils";

// Create kernels with sharedWorker: true to share a single worker between apps.
// This reduces memory usage when running multiple apps on the same page.
// Note: SharedWorker is not supported in all browsers (e.g., Chrome Android).
const kernel1 = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.write("Hello, stlite!")
st.write("Shared Worker App 1")

# This variable is shared across all apps using the same SharedWorker
if "shared_counter" not in st.session_state:
    st.session_state.shared_counter = 0

if st.button("Increment shared counter"):
    st.session_state.shared_counter += 1

st.write(f"Shared counter: {st.session_state.shared_counter}")
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

# This variable is shared across all apps using the same SharedWorker
if "shared_counter" not in st.session_state:
    st.session_state.shared_counter = 0

if st.button("Increment shared counter"):
    st.session_state.shared_counter += 1

st.write(f"Shared counter: {st.session_state.shared_counter}")
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
        <StliteAppWithToast kernel={kernel1} mountDocumentStyles={false} />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <StliteAppWithToast kernel={kernel2} mountDocumentStyles={false} />
      </div>
    </div>
  );
}
