import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/stlite-kernel";
import { getAppDataFromUrl } from "@stlite/sharing-common";
import StreamlitApp from "./StreamlitApp";

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const appData = getAppDataFromUrl();

    console.debug("Initialize with", appData);

    if (appData == null) {
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
      return;
    }

    let files: StliteKernelOptions["files"];
    files = {};
    Object.keys(appData.files).forEach((key) => {
      const value = appData.files[key];
      files[key] = {
        data: value.type === "text" ? value.data : new Uint8Array(value.data),
      };
    });

    const kernel = new StliteKernel({
      command: "run",
      entrypoint: appData.entrypoint,
      files,
      requirements: appData.requirements,
    });
    setKernel(kernel);

    return () => {
      kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel}></StreamlitApp> : null;
}

export default App;
