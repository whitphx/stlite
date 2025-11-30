import type { Plugin } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

declare const STREAMLIT_WHEEL_FILE_NAME: string;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REACT_PACKAGE_ROOT = path.resolve(__dirname, "../..");
const REACT_PACKAGE_BUNDLED_WHEEL_DIR = path.resolve(
  REACT_PACKAGE_ROOT,
  "./build/wheels",
);

interface VitePluginStliteReactOptions {
  streamlitWheelFilePath: string;
  stliteLibWheelFilePath?: string;
}
export default function vitePluginStliteReact(
  options?: VitePluginStliteReactOptions,
): Plugin {
  return {
    name: "vite-plugin-stlite-react",
    config: (config, { mode }) => {
      return {
        resolve: {
          alias: {
            "stlite_lib.whl":
              options?.stliteLibWheelFilePath ??
              path.join(
                REACT_PACKAGE_BUNDLED_WHEEL_DIR,
                STREAMLIT_WHEEL_FILE_NAME,
              ),
            "streamlit.whl":
              options?.streamlitWheelFilePath ??
              path.join(
                REACT_PACKAGE_BUNDLED_WHEEL_DIR,
                "stlite_lib-0.1.0-py3-none-any.whl",
              ),
          },
        },
        assetsInclude: ["**/*.whl"],
        optimizeDeps: {
          exclude: ["parquet-wasm"],
        },
        worker: {
          format: "es",
        },
        define: {
          "process.env.NODE_ENV": JSON.stringify(mode),
        },
      };
    },
  };
}
