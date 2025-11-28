import React from "react";
import { createRoot } from "react-dom/client";
import { StliteAppWithToast, createKernel, wheelUrls } from "@stlite/react";
import "@stlite/react/stlite.css";
import { type MicropipInstallOptions } from "@stlite/react";
import { parseMountOptions, MountOptions } from "./options";

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastOptions } = parseMountOptions(options);

  const kernel = createKernel({
    ...kernelOptions,
    wheelUrls: kernelOptions.wheelUrls ?? wheelUrls,
  });

  const reactRoot = createRoot(container);
  reactRoot.render(
    <React.StrictMode>
      <StliteAppWithToast kernel={kernel} {...toastOptions} />
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
  };
}
