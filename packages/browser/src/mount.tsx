import React from "react";
import ReactDOM from "react-dom";
import StreamlitApp from "./StreamlitApp";
import { StliteKernel } from "@stlite/kernel";
import { parseMountOptions, MountOptions } from "./options";
import {
  ToastContainer,
  makeToastKernelCallbacks,
  StliteKernelWithToast,
} from "@stlite/common-react";

const wheelBaseUrl =
  process.env.NODE_ENV === "production"
    ? import.meta.url
    : window.location.origin;
const wheelUrls = {
  stliteLib: new URL("wheels/stlite_lib-0.1.0-py3-none-any.whl", wheelBaseUrl)
    .href,
  streamlit: new URL("wheels/streamlit-1.41.0-cp312-none-any.whl", wheelBaseUrl)
    .href,
};

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastCallbackOptions } = parseMountOptions(options);
  const kernel = new StliteKernel({
    ...kernelOptions,
    wheelUrls,
    ...makeToastKernelCallbacks(toastCallbackOptions),
    workerType:
      process.env.NODE_ENV === "development"
        ? "module" // Vite loads the worker scripts as ES modules without bundling at dev time, so we need to specify the type as "module" for the "import" statements in the worker script to work.
        : "classic", // type="classic" is needed for the cross-origin worker trick to work in the page loaded via `file://` scheme, so we use it for the production build.
  });

  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <React.StrictMode>
      <StreamlitApp kernel={kernel} />
      <ToastContainer />
    </React.StrictMode>,
    container,
  );

  const kernelWithToast = new StliteKernelWithToast(kernel);

  return {
    unmount: () => {
      kernel.dispose();
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container);
    },
    install: (requirements: string[]) => {
      return kernelWithToast.install(requirements);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, unknown>,
    ) => {
      return kernelWithToast.writeFile(path, data, opts);
    },
    renameFile: (oldPath: string, newPath: string) => {
      return kernelWithToast.renameFile(oldPath, newPath);
    },
    unlink: (path: string) => {
      return kernelWithToast.unlink(path);
    },
    readFile: (path: string, opts?: Record<string, unknown>) => {
      return kernelWithToast.readFile(path, opts);
    },
  };
}
