import React, { useState, useEffect } from "react";
import { StliteKernel } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const kernel = new StliteKernel({
      command: "run",
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: `import streamlit as st
st.write("Hello World")`,
        },
      },
      requirements: [],
    });
    setKernel(kernel);

    return () => {
      kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel}></StreamlitApp> : null;
}

export default App;
