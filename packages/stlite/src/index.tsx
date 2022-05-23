import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StliteKernel } from "@stlite/stlite-kernel";

export interface MountOptions extends Partial<StliteKernel.IOptions> {
  container?: HTMLElement;
}

const DEFAULT_PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js";

const currentScriptSrc = (document.currentScript as
  | HTMLScriptElement
  | undefined)?.src;
const wheelsBaseUrl = currentScriptSrc
  ? currentScriptSrc
      .split("/")
      .slice(0, -1)
      .join("/") // Assuming that this `index.tsx` is bundled into the main script at the root (e.g. `<BASE_URL>/stlite.js`) which leads `wheelsBaseUrl` to be <BASE_URL>`.
  : undefined;

export function mount(options?: MountOptions) {
  const container = options?.container || document.body;

  const kernel = new StliteKernel({
    pyodideUrl: options?.pyodideUrl || DEFAULT_PYODIDE_URL,
    command: options?.command || (options?.mainScriptData ? "run" : "hello"),
    wheelsBaseUrl,
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
