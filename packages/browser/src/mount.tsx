import React from "react";
import { createRoot } from "react-dom/client";
import {
  StliteAppWithToast,
  createKernel,
  type MicropipInstallOptions,
} from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";
import "@stlite/react/stlite.css";
import { parseMountOptions, MountOptions } from "./options";

// Pyodide 314 refuses to load in a classic worker, so the worker is a module
// worker in production too. On file:// pages, CrossOriginWorkerMaker starts it
// from a data: URL instead of a blob: URL so that it still loads there.
const workerType = "module";

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastOptions, styleOptions } =
    parseMountOptions(options);

  const kernel = createKernel({
    ...kernelOptions,
    wheelUrls: kernelOptions.wheelUrls ?? wheelUrls,
    workerType,
  });

  const reactRoot = createRoot(container);
  reactRoot.render(
    <React.StrictMode>
      <StliteAppWithToast kernel={kernel} {...toastOptions} {...styleOptions} />
    </React.StrictMode>,
  );

  return {
    unmount: () => {
      kernel.dispose();
      reactRoot.unmount();
    },
    install: (requirements: string[], options?: MicropipInstallOptions) => {
      return kernel.install(requirements, options);
    },
    addMockPackage: (
      name: string,
      version: string,
      modules?: Record<string, string>,
      persistent?: boolean,
    ) => {
      return kernel.addMockPackage(name, version, modules, persistent);
    },
    writeFile: (
      path: string,
      data: string | ArrayBufferView,
      opts?: Record<string, unknown>,
    ) => {
      return kernel.writeFile(path, data, opts);
    },
    renameFile: (oldPath: string, newPath: string) => {
      return kernel.renameFile(oldPath, newPath);
    },
    unlink: (path: string) => {
      return kernel.unlink(path);
    },
    readFile: (path: string, opts?: Record<string, unknown>) => {
      return kernel.readFile(path, opts);
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
    /**
     * Made public for advanced use cases as an unstable API.
     * You can use it but there is no stability guarantee for future releases.
     */
    _kernel: kernel,
  };
}
