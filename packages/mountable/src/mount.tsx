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
import "react-toastify/dist/ReactToastify.css";
import "@stlite/common-react/src/toastify-components/toastify.css";

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
