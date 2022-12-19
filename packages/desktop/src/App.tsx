import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/kernel";
import StreamlitApp from "./StreamlitApp";
import { makeToastKernelCallbacks } from "@stlite/common-react";
import "@stlite/common-react/src/toastify-components/toastify.css";

let pyodideEntrypointUrl: string | undefined;
if (process.env.NODE_ENV === "production") {
  // The `pyodide` directory including `pyodide.js` is downloaded
  // to the build target directory at the build time for production release.
  // See the "build:pyodide" NPM script.
  // Ref: https://pyodide.org/en/stable/usage/downloading-and-deploying.html
  // We set the path here to be loaded in the worker via `importScript()`.
  const currentURL = window.location.href;
  const parentURL = currentURL.split("/").slice(0, -1).join("/") + "/";
  pyodideEntrypointUrl = parentURL + "pyodide/pyodide.js";
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    Promise.all([
      window.archives.readSitePackagesSnapshot(),
      window.archives.readStreamlitAppDirectory(),
    ]).then(([sitePackagesSnapshotFileBin, streamlitAppFiles]) => {
      if (unmounted) {
        return;
      }

      const files: StliteKernelOptions["files"] = {};
      Object.keys(streamlitAppFiles).forEach((path) => {
        const data = streamlitAppFiles[path];
        files[path] = {
          data,
        };
      });

      const mountedSitePackagesSnapshotFilePath =
        "/tmp/site-packages-snapshot.tar.gz";
      kernel = new StliteKernel({
        entrypoint: "streamlit_app.py",
        files: {
          ...files,
          [mountedSitePackagesSnapshotFilePath]: {
            data: sitePackagesSnapshotFileBin,
          },
        },
        requirements: [],
        mountedSitePackagesSnapshotFilePath,
        pyodideEntrypointUrl,
        ...makeToastKernelCallbacks(),
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
