import { useState, useEffect } from "react";
import "./App.css";

import EditorModal from "./EditorModal";

import { StliteKernel, StliteKernelProvider } from "@stlite/stlite-kernel";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

const DEFAULT_VALUE = `import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)`;

const DEFAULT_REQUIREMENTS = ["matplotlib"];

function App() {
  const [mainScriptData, setMainScriptData] = useState(DEFAULT_VALUE);

  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const kernel = new StliteKernel({
      pyodideUrl: "https://cdn.jsdelivr.net/pyodide/v0.21.0/full/pyodide.js",
      command: "run",
      requirements: DEFAULT_REQUIREMENTS,
      mainScriptData,
    });
    setKernel(kernel);

    return () => {
      kernel.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (kernel == null) {
      return;
    }

    kernel.setMainScriptData(mainScriptData);
  }, [kernel, mainScriptData]);

  return (
    <>
      <EditorModal
        defaultValue={mainScriptData}
        onChange={setMainScriptData}
        defaultRequirementsValue={DEFAULT_REQUIREMENTS.join("\n")}
        onInstallRequired={(requirements) => {
          kernel?.install(requirements).then(() => {
            console.log("Installed");
          });
        }}
      />
      {kernel && (
        <StliteKernelProvider kernel={kernel}>
          <StyletronProvider value={engine}>
            <ThemedApp />
          </StyletronProvider>
        </StliteKernelProvider>
      )}
    </>
  );
}

export default App;
