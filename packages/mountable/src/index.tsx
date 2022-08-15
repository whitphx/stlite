import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StliteKernel } from "@stlite/stlite-kernel";

export interface MountOptions extends Partial<StliteKernel.IOptions> {
  container?: HTMLElement;
  requirements?: string[];
}

const DEFAULT_PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.21.0/full/pyodide.js";

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
    requirements: ["opencv-python"],
    command: "run",
    mainScriptData: `import streamlit as st
import pandas as pd
import numpy as np
import cv2

st.write("Hello world")

chart_data = pd.DataFrame(
    np.random.randn(20, 3),
    columns=['a', 'b', 'c'])
st.write(chart_data)
st.line_chart(chart_data)

img_file_buffer = st.camera_input("Take a picture")

if img_file_buffer is not None:
    bytes_data = img_file_buffer.getvalue()
    cv2_img = cv2.imdecode(np.frombuffer(bytes_data, np.uint8), cv2.IMREAD_COLOR)

    cv2_img = cv2.Canny(cv2_img, 100, 200)

    st.image(cv2_img)
`,
    container: document.getElementById("root") as HTMLElement,
  });
}
