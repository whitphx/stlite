import path from "node:path";
import stliteLibWheelUrl from "stlite_lib.whl"; // This is an alias configured in vitest.config.ts
import streamlitWheelUrl from "streamlit.whl"; // This is an alias configured in vitest.config.ts

export const pyodideUrl = path.resolve(
  "../../node_modules/pyodide/pyodide.mjs",
); // Installed at the Yarn workspace root;

export function getWheelInstallPath(wheelImportUrl: string): string {
  // `wheelImportUrl` is like `/path/to/stlite_lib.whl` that is a URL path.
  // We need to convert it to a local file path so that it can be referred to in the test environment i.e. Node.js.
  // Also, we need to add `file://` scheme to it so that `micropip.install()` can install it.
  return "file://" + path.resolve("." + wheelImportUrl);
}

export function getWheelUrls() {
  return {
    stliteLib: getWheelInstallPath(stliteLibWheelUrl),
    streamlit: getWheelInstallPath(streamlitWheelUrl),
  };
}
