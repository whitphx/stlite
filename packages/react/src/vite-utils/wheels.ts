// Import utility for Vite to resolve wheel file URLs.
// Should be used only in the context of Vite bundling with our Vite plugin.

// These imports will be resolved by Vite with our custom plugin to the final URLs.
// See packages/react/vite-plugin/src/index.ts.
import STLITE_LIB_WHEEL from "stlite_lib.whl";
import STREAMLIT_WHEEL from "streamlit.whl";

import type { StliteKernelOptions } from "@stlite/kernel";

// WHEEL_BASE_URL is replaced with `import.meta.url`,
// and it is intended to be finally resolved to the actual URL
// in a downstream application's bundling process.
declare const WHEEL_BASE_URL: string;

export const wheelUrls: StliteKernelOptions["wheelUrls"] = {
  // Vite resolves asset imports such as stlite_lib.whl and streamlit.whl above
  // to path-only URLs in the production build, e.g. "/assets/stlite_lib-0.1.0-py3-none-any.whl".
  // However, micropip treats such path-only URLs as local file URLs meaning "file:////assets/stlite_lib-0.1.0-py3-none-any.whl"
  // since 0.7.0 due to the change by https://github.com/pyodide/micropip/pull/145,
  // while we intend them to be remote URLs.
  // So we need to convert these path-only URLs to full URLs including the protocol explicitly.
  stliteLib: new URL(STLITE_LIB_WHEEL, WHEEL_BASE_URL).href,
  streamlit: new URL(STREAMLIT_WHEEL, WHEEL_BASE_URL).href,
};
