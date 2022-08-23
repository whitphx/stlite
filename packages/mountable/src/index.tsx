import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StliteKernel } from "@stlite/stlite-kernel";
import { canonicalizeMountOptions, MountOptions } from "./options";

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body
) {
  const kernel = new StliteKernel(canonicalizeMountOptions(options));

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
    install: (requirements: string[]) => {
      return kernel.install(requirements);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, any>
    ) => {
      return kernel.writeFile(path, data, opts);
    },
  };
}

if (process.env.NODE_ENV === "development") {
  mount(
    //     `import streamlit as st

    // st.write("Hello world")
    //     `,
    {
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": `import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)
    `,
      },
      requirements: ["matplotlib"],
    },
    document.getElementById("root") as HTMLElement
  );
}
