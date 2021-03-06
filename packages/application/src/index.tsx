import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StliteKernel } from "@stlite/stlite-kernel";

export interface MountOptions extends Partial<StliteKernel.IOptions> {
  container?: HTMLElement;
}

const DEFAULT_PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js";

export function mount(options?: MountOptions) {
  const container = options?.container || document.body;

  const kernel = new StliteKernel({
    pyodideUrl: options?.pyodideUrl || DEFAULT_PYODIDE_URL,
    command: options?.command || (options?.mainScriptData ? "run" : "hello"),
    ...options,
  });

  ReactDOM.render(
    <React.StrictMode>
      <App kernel={kernel} />
    </React.StrictMode>,
    container
  );

  return {
    unmount: () => {
      kernel.dispose();
      ReactDOM.unmountComponentAtNode(container);
    },
    setMainScriptData: (mainScriptData: string) => {
      kernel.setMainScriptData(mainScriptData);
    },
  };
}

if (process.env.NODE_ENV === "development") {
  mount({
    command: "run",
    mainScriptData: `import streamlit as st

st.write("Hello World")`,
  });
}
