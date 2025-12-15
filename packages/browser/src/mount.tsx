import React from "react";
import { createRoot } from "react-dom/client";
import {
  StliteAppWithToast,
  createKernel,
  type MicropipInstallOptions,
  type AddMockPackageOptions,
} from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";
import "@stlite/react/stlite.css";
import { parseMountOptions, MountOptions } from "./options";

const workerType =
  // @ts-expect-error process.env.NODE_ENV is defined by Vite
  process.env.NODE_ENV === "development"
    ? "module" // Vite loads the worker scripts as ES modules without bundling at dev time, so we need to specify the type as "module" for the "import" statements in the worker script to work.
    : "classic"; // type="classic" is needed for the cross-origin worker trick to work in the page loaded via `file://` scheme, so we use it for the production build.

export function mount(
  options: MountOptions,
  container: HTMLElement = document.body,
) {
  const { kernelOptions, toastOptions } = parseMountOptions(options);

  const kernel = createKernel({
    ...kernelOptions,
    wheelUrls: kernelOptions.wheelUrls ?? wheelUrls,
    workerType,
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
    addMockPackage: (
      name: string,
      version: string,
      modules?: Record<string, string>,
      options?: AddMockPackageOptions,
    ) => {
      return kernel.addMockPackage(name, version, modules, options);
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
