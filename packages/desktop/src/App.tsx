import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/kernel";
import StreamlitApp from "./StreamlitApp";
import { makeToastKernelCallbacks } from "@stlite/common-react";
import { USE_NODEJS_WORKER, NodeJsWorkerMock } from "./nodejs-worker";
import "@stlite/common-react/src/toastify-components/toastify.css";

let pyodideUrl: string | undefined;
if (process.env.NODE_ENV === "production" && !USE_NODEJS_WORKER) {
  // The `pyodide` directory including `pyodide.js` is downloaded
  // to the build target directory at the build time for production release.
  // See the "build:pyodide" NPM script.
  // Ref: https://pyodide.org/en/stable/usage/downloading-and-deploying.html
  // We set the path here to be loaded in the worker via `importScript()`.
  const currentURL = window.location.href;
  const parentURL = currentURL.split("/").slice(0, -1).join("/") + "/";
  pyodideUrl = parentURL + "pyodide/pyodide.mjs";
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    Promise.all([
      window.archivesAPI.readSitePackagesSnapshot(),
      window.archivesAPI.readPrebuiltPackageNames(),
      window.archivesAPI.readStreamlitAppDirectory(),
    ]).then(
      ([
        sitePackagesSnapshotFileBin,
        prebuiltPackageNames,
        streamlitAppFiles,
      ]) => {
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
          archives: [],
          requirements: [],
          prebuiltPackageNames,
          mountedSitePackagesSnapshotFilePath,
          pyodideUrl,
          idbfsMountpoints: window.appConfig.idbfsMountpoints,
          worker: USE_NODEJS_WORKER
            ? (new NodeJsWorkerMock() as unknown as Worker)
            : undefined,
          ...makeToastKernelCallbacks(),
        });
        setKernel(kernel);
      }
    );

    return () => {
      unmounted = true;
      kernel && kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel} /> : null;
}

export default App;
