import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/stlite-kernel";
import { AppData, extractAppDataFromUrl } from "@stlite/sharing-common";
import StreamlitApp from "./StreamlitApp";

function convertFiles(
  appDataFiles: AppData["files"]
): StliteKernelOptions["files"] {
  let files: StliteKernelOptions["files"] = {};
  Object.keys(appDataFiles).forEach((key) => {
    const value = appDataFiles[key];
    files[key] = {
      data: value.type === "text" ? value.data : new Uint8Array(value.data),
    };
  });
  return files;
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const appData = extractAppDataFromUrl();

    console.debug("Initialize with", appData);

    const kernel = new StliteKernel(
      appData
        ? {
            command: "run",
            entrypoint: appData.entrypoint,
            files: convertFiles(appData.files),
            requirements: appData.requirements,
          }
        : {
            command: "run",
            entrypoint: "streamlit_app.py",
            files: {
              "streamlit_app.py": {
                data: `import streamlit as st
st.write("Hello World")`,
              },
            },
            requirements: [],
          }
    );
    setKernel(kernel);

    return () => {
      kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel}></StreamlitApp> : null;
}

export default App;
