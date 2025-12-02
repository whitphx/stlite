import type { Plugin } from "vite";
import type { PreRenderedAsset } from "rollup";
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
  wheelOutputDir?: string;
  streamlitWheelFilePath: string;
  stliteLibWheelFilePath?: string;
}
export default function vitePluginStliteReact(
  options?: VitePluginStliteReactOptions,
): Plugin {
  const { wheelOutputDir = "wheels" } = options ?? {};
  return {
    name: "vite-plugin-stlite-react",
    config: () => {
      return {
        resolve: {
          alias: {
            "streamlit.whl":
              options?.streamlitWheelFilePath ??
              path.join(
                REACT_PACKAGE_BUNDLED_WHEEL_DIR,
                STREAMLIT_WHEEL_FILE_NAME,
              ),
            "stlite_lib.whl":
              options?.stliteLibWheelFilePath ??
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
      };
    },
    outputOptions(outputOptions) {
      const originalAssetFileNames = outputOptions.assetFileNames;
      outputOptions.assetFileNames = (assetInfo: PreRenderedAsset) => {
        // Preserve original .whl filenames without hashing to comply with the file name convention
        // defined in https://packaging.python.org/en/latest/specifications/binary-distribution-format/#file-name-convention.
        if (assetInfo.names?.some((name) => name.endsWith(".whl"))) {
          return path.join(wheelOutputDir, "[name][extname]");
        }
        // Fall back to original behavior
        if (typeof originalAssetFileNames === "function") {
          return originalAssetFileNames(assetInfo);
        }
        return originalAssetFileNames ?? "assets/[name]-[hash][extname]";
      };
      return outputOptions;
    },
  };
}
