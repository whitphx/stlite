import { StliteAppWithToast, createKernel } from "../../src/index";
import { wheelUrls } from "../../src/vite-utils";

const kernel = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.title("Hello, Stlite!")
st.write("This app runs entirely in your browser.")

name = st.text_input("Your name")
if name:
    st.write(f"Hello, {name}!")
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
});

export function App() {
  return <StliteAppWithToast kernel={kernel} />;
}
