import { StliteAppWithToast, useKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";

export function App() {
  const kernel = useKernel({
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

  return kernel ? <StliteAppWithToast kernel={kernel} /> : null;
}
