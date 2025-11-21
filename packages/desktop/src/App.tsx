import { useState, useEffect } from "react";
import type { StliteKernel, StliteKernelOptions } from "@stlite/kernel";
import { StliteApp, createKernel } from "@stlite/react";
import { makeToastKernelCallbacks } from "@stlite/common-react";
import { USE_NODEJS_WORKER, NodeJsWorkerMock } from "./nodejs-worker";

let pyodideUrl: string | undefined;
if (import.meta.env.MODE === "production" && !USE_NODEJS_WORKER) {
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

        kernel = createKernel({
          entrypoint: window.appConfig.entrypoint,
          files,
          archives: [
            {
              buffer: sitePackagesSnapshotFileBin,
              format: "gztar",
              options: {
                extractDir: "/",
              },
            },
          ],
          requirements: [],
          prebuiltPackageNames,
          pyodideUrl,
          wheelUrls: undefined,
          idbfsMountpoints: window.appConfig.idbfsMountpoints,
          worker: USE_NODEJS_WORKER
            ? (new NodeJsWorkerMock() as unknown as Worker)
            : undefined,
          ...makeToastKernelCallbacks(),
        });
        setKernel(kernel);
      },
    );

    return () => {
      unmounted = true;
      kernel?.dispose();
    };
  }, []);

  return kernel ? <StliteApp kernel={kernel} /> : null;
}

export default App;
