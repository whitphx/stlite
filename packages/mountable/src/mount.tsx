import React from "react";
import ReactDOM from "react-dom";
import StreamlitApp from "./StreamlitApp";
import { StliteKernel } from "@stlite/kernel";
import type { InMessage, OutMessage, ReplyMessage } from "@stlite/kernel";
import { getParentUrl } from "./url";
import { parseMountOptions, MountOptions } from "./options";
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
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastCallbackOptions } = parseMountOptions(options);
  const kernel = new StliteKernel({
    ...kernelOptions,
    wheelBaseUrl,
    ...makeToastKernelCallbacks(toastCallbackOptions),
  });

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
      ReactDOM.unmountComponentAtNode(container);
    },
    install: (requirements: string[]) => {
      return kernelWithToast.install(requirements);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, any>,
    ) => {
      return kernelWithToast.writeFile(path, data, opts);
    },
    renameFile: (oldPath: string, newPath: string) => {
      return kernelWithToast.renameFile(oldPath, newPath);
    },
    unlink: (path: string) => {
      return kernelWithToast.unlink(path);
    },
    readFile: (path: string, opts?: Record<string, any>) => {
      return kernelWithToast.readFile(path, opts);
    },
  };
}
