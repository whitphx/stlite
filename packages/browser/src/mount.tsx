import React from "react";
import { createRoot } from "react-dom/client";
import { StliteApp, createKernel } from "@stlite/react";
import { type MicropipInstallOptions } from "@stlite/kernel";
import { parseMountOptions, MountOptions } from "./options";
import {
  ToastContainer,
  makeToastKernelEventListeners,
  StliteKernelWithToast,
} from "@stlite/common-react";

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastOptions } = parseMountOptions(options);

  const kernel = createKernel(kernelOptions);

  const kernelEventListenersForToast = makeToastKernelEventListeners();
  if (!toastOptions.disableProgressToasts) {
    kernel.addEventListener(
      "loadProgress",
      kernelEventListenersForToast.onLoadProgress,
    );
    kernel.addEventListener(
      "loadFinished",
      kernelEventListenersForToast.onLoadFinished,
    );
  }
  if (!toastOptions.disableErrorToasts) {
    kernel.addEventListener(
      "loadError",
      kernelEventListenersForToast.onLoadError,
    );
  }
  if (!toastOptions.disableModuleAutoLoadToasts) {
    kernel.addEventListener(
      "moduleAutoLoad",
      kernelEventListenersForToast.onModuleAutoLoad,
    );
  }

  const reactRoot = createRoot(container);
  reactRoot.render(
    <React.StrictMode>
      <StliteApp kernel={kernel} />
      <ToastContainer />
    </React.StrictMode>,
  );

  const kernelWithToast = new StliteKernelWithToast(kernel);

  return {
    unmount: () => {
      kernel.dispose();
      reactRoot.unmount();
    },
    install: (requirements: string[], options?: MicropipInstallOptions) => {
      return kernelWithToast.install(requirements, options);
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
    getCodeCompletion: (
      code: string,
      position: { line: number; column: number },
    ) => {
      return kernel.getCodeCompletion(code, position);
    },
    runPython: (code: string) => {
      return kernel.runPython(code);
    },
  };
}
