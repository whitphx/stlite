import path from "node:path";

export const pyodideUrl = path.resolve(
  "../../node_modules/pyodide/pyodide.mjs",
); // Installed at the Yarn workspace root;

export function getWheelInstallPath(wheelImportUrl: string): string {
  // `wheelImportUrl` is like `/path/to/stlite_lib.whl` that is a URL path.
  // We need to convert it to a local file path so that it can be referred to in the test environment i.e. Node.js.
  // Also, we need to add `file://` scheme to it so that `micropip.install()` can install it.
  return "file://" + path.resolve("." + wheelImportUrl);
}
