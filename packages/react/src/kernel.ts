import { StliteKernel, type StliteKernelOptions } from "@stlite/kernel";

import STLITE_LIB_WHEEL from "stlite_lib.whl";
import STREAMLIT_WHEEL from "streamlit.whl";

const wheelBaseUrl =
  process.env.NODE_ENV === "production"
    ? import.meta.url
    : window.location.origin;

const wheelUrls = {
  // The resolved URLs such as STLITE_LIB_WHEEL only contain the pathnames e.g. "/assets/stlite_lib-0.1.0-py3-none-any.whl"
  // and micropip treats such path-only URLs as local file URLs e.g. "file:////assets/stlite_lib-0.1.0-py3-none-any.whl"
  // since 0.7.0 due to the change by https://github.com/pyodide/micropip/pull/145,
  // though these URLs are actually for remote resources.
  // So we need to convert these path-only URLs to full URLs including the protocol explicitly.
  stliteLib: new URL(STLITE_LIB_WHEEL, wheelBaseUrl).href,
  streamlit: new URL(STREAMLIT_WHEEL, wheelBaseUrl).href,
};

const workerType =
  process.env.NODE_ENV === "development"
    ? "module" // Vite loads the worker scripts as ES modules without bundling at dev time, so we need to specify the type as "module" for the "import" statements in the worker script to work.
    : "classic"; // type="classic" is needed for the cross-origin worker trick to work in the page loaded via `file://` scheme, so we use it for the production build.

export function createKernel(kernelOptions: StliteKernelOptions) {
  return new StliteKernel({
    ...kernelOptions,
    wheelUrls: kernelOptions.wheelUrls ?? wheelUrls,
    workerType: kernelOptions.workerType ?? workerType,
  });
}
