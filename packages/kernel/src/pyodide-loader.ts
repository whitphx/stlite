import type Pyodide from "pyodide";

export async function initPyodide(
  pyodideUrl: string,
  loadPyodideOptions: Parameters<typeof Pyodide.loadPyodide>[0],
): Promise<Pyodide.PyodideInterface> {
  const isNode = typeof process !== "undefined" && process.versions?.node;

  let sep: string;
  if (isNode) {
    const nodePath = await import(/* webpackIgnore: true */ "node:path");
    sep = nodePath.sep;
  } else {
    sep = "/"; // URL path separator
  }

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/kernel.ts#L55
  const indexUrl = pyodideUrl.slice(0, pyodideUrl.lastIndexOf(sep) + 1);

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/worker.ts#L40-L54
  let loadPyodide: typeof Pyodide.loadPyodide;
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
    // note: this does not work at all in firefox
    const pyodideModule: typeof Pyodide = await import(
      /* webpackIgnore: true */ pyodideUrl
    );
    loadPyodide = pyodideModule.loadPyodide;
  } else {
    importScripts(pyodideUrl);
    loadPyodide = (self as any).loadPyodide;
  }
  return loadPyodide({ ...loadPyodideOptions, indexURL: indexUrl });
}
