import React from "react";
import ReactDOM from "react-dom";
import StreamlitApp from "./StreamlitApp";
import { StliteKernel } from "@stlite/kernel";
import { getParentUrl } from "./url";
import { canonicalizeMountOptions, MountOptions } from "./options";
import {
  ToastContainer,
  makeToastKernelCallbacks,
  StliteKernelWithToast,
} from "@stlite/common-react";
import "react-toastify/dist/ReactToastify.css";
import "@stlite/common-react/src/toastify-components/toastify.css";

/**
 * If `PUBLIC_PATH` which is exported as a global variable `__webpack_public_path__` (https://webpack.js.org/guides/public-path/#on-the-fly)
 * is set as a relative URL, resolve and override it based on the URL of this script itself,
 * which will be transpiled into `stlite.js` at the root of the output directory.
 */
let wheelBaseUrl: string | undefined = undefined;
if (
  typeof __webpack_public_path__ === "string" &&
  (__webpack_public_path__ === "." || __webpack_public_path__.startsWith("./"))
) {
  if (document.currentScript && "src" in document.currentScript) {
    const selfScriptUrl = document.currentScript.src;
    const selfScriptBaseUrl = getParentUrl(selfScriptUrl);

    __webpack_public_path__ = selfScriptBaseUrl; // For webpack dynamic imports
    wheelBaseUrl = selfScriptBaseUrl;
  }
}

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body
) {
  const kernel = new StliteKernel({
    ...canonicalizeMountOptions(options),
    wheelBaseUrl,
    ...makeToastKernelCallbacks(),
  });

  ReactDOM.render(
    <React.StrictMode>
      <StreamlitApp kernel={kernel} />
      <ToastContainer />
    </React.StrictMode>,
    container
  );

  const kernelWithToast = new StliteKernelWithToast(kernel);

  return {
    unmount: () => {
      kernel.dispose();
      ReactDOM.unmountComponentAtNode(container);
    },
    install: (requirements: string[]) => {
      return kernelWithToast.install(requirements);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, any>
    ) => {
      return kernelWithToast.writeFile(path, data, opts);
    },
    renameFile: (oldPath: string, newPath: string) => {
      return kernelWithToast.renameFile(oldPath, newPath);
    },
    unlink: (path: string) => {
      return kernelWithToast.unlink(path);
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

st.latex(r'''
     a + ar + a r^2 + a r^3 + \\cdots + a r^{n-1} =
     \\sum_{k=0}^{n-1} ar^k =
     a \\left(\\frac{1-r^{n}}{1-r}\\right)
     ''')

import pandas as pd
import numpy as np

df = pd.DataFrame(
     np.random.randn(1000, 2) / [50, 50] + [37.76, -122.4],
     columns=['lat', 'lon'])

st.map(df)
    `,
      },
      requirements: ["matplotlib"],
    },
    document.getElementById("root") as HTMLElement
  );
}
