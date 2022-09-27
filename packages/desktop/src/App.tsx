import React, { useMemo } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

function App() {
  const kernel = useMemo(
    () =>
      new StliteKernel({
        command: "run",
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            data: `import streamlit as st

st.write("Hello, Electron!")`,
          },
        },
        requirements: [],
      }),
    []
  );
  return <StreamlitApp kernel={kernel} />;
}

export default App;
