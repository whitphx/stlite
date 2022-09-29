import React, { useState, useEffect } from "react";
import { StliteKernel } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

let pyodideEntrypointUrl: string | undefined;
if (process.env.NODE_ENV === "production") {
  // The `pyodide` directory including `pyodide.js` is downloaded
  // to the build target directory at the build time for production release.
  // See the "build:pyodide" NPM script.
  // Ref: https://pyodide.org/en/stable/usage/downloading-and-deploying.html
  // We set the path here to be loaded in the worker via `importScript()`.
  const currentURL = window.location.href;
  const parentURL =
    currentURL
      .split("/")
      .slice(0, -1)
      .join("/") + "/";
  pyodideEntrypointUrl = parentURL + "pyodide/pyodide.js";
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    window.archives
      .readSitePackagesSnapshot()
      .then((sitePackagesSnapshotFileBin) => {
        if (unmounted) {
          return;
        }

        const mountedSitePackagesSnapshotFilePath =
          "/tmp/site-packages-snapshot.tar.gz";
        kernel = new StliteKernel({
          command: "run",
          entrypoint: "streamlit_app.py",
          files: {
            "streamlit_app.py": {
              data: `import streamlit as st

name = st.text_input("name")
st.write("Hello,", name or "Electron!")

import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000, 100)
arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)

st.image("https://raw.githubusercontent.com/whitphx/stlite/main/docs/images/logo.svg")
`,
            },
            [mountedSitePackagesSnapshotFilePath]: {
              data: sitePackagesSnapshotFileBin,
            },
          },
          requirements: [],
          mountedSitePackagesSnapshotFilePath,
          pyodideEntrypointUrl,
        });
        setKernel(kernel);
      });

    return () => {
      unmounted = true;
      kernel && kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel} /> : null;
}

export default App;
