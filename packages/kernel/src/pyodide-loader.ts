/// <reference lib="WebWorker" />

import type Pyodide from "pyodide";

interface ResolvePyodideUrlResult {
  scriptURL: string;
  pyodideIndexURL: string;
  isESModule: boolean;
}
export async function resolvePyodideUrl(
  pyodideUrl: string,
): Promise<ResolvePyodideUrlResult> {
  const isNode = typeof process !== "undefined" && process.versions?.node;

  let sep: string;
  if (isNode) {
    const nodePath = await import(/* webpackIgnore: true */ "node:path");
    sep = nodePath.sep;
  } else {
    sep = "/"; // URL path separator
  }

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/kernel.ts#L55
  const pyodideIndexURL = pyodideUrl.slice(0, pyodideUrl.lastIndexOf(sep) + 1);

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/worker.ts#L40-L54
  if (pyodideUrl.endsWith(".mjs")) {
    if (isNode) {
      // Special care for Node.js on Windows because the `file://` scheme is required in the URL passed to import() on Windows. See https://github.com/whitphx/stlite/issues/957
      const nodePath = await import(/* webpackIgnore: true */ "node:path");
      const nodeUrl = await import(/* webpackIgnore: true */ "node:url");
      const possiblyLocalFilePath = !pyodideUrl.includes("://");
      if (possiblyLocalFilePath && nodePath.isAbsolute(pyodideUrl)) {
        pyodideUrl = nodeUrl.pathToFileURL(pyodideUrl).href;
      }
    }
    return {
      scriptURL: pyodideUrl,
      pyodideIndexURL,
      isESModule: true,
    };
  } else {
    return {
      scriptURL: pyodideUrl,
      pyodideIndexURL,
      isESModule: false,
    };
  }
}

export async function initPyodide(
  pyodideUrl: string,
  loadPyodideOptions: Parameters<typeof Pyodide.loadPyodide>[0],
): Promise<Pyodide.PyodideInterface> {
  const { scriptURL, pyodideIndexURL, isESModule } =
    await resolvePyodideUrl(pyodideUrl);

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/worker.ts#L40-L54
  let loadPyodide: typeof Pyodide.loadPyodide;
  if (isESModule) {
    // note: this does not work at all in firefox
    const pyodideModule: typeof Pyodide = await import(
      /* webpackIgnore: true */ /* @vite-ignore */ scriptURL
    );
    loadPyodide = pyodideModule.loadPyodide;
  } else {
    importScripts(scriptURL);
    loadPyodide = (
      self as unknown as { loadPyodide: typeof Pyodide.loadPyodide }
    ).loadPyodide;
  }
  return loadPyodide({ ...loadPyodideOptions, indexURL: pyodideIndexURL });
}
