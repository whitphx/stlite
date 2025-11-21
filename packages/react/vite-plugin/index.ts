import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REACT_PACKAGE_ROOT = path.resolve(__dirname, "..");

function getStreamlitWheelFileName(): string {
  const wheelFileNameRegex =
    /^streamlit-(\d+\.\d+\.\d+)-(py3|cp3\d+)-none-any\.whl$/;
  const bundleWheelDir = path.resolve(REACT_PACKAGE_ROOT, "./build/wheels");
  const files = fs.readdirSync(bundleWheelDir);
  const matchedFiles = files.filter((file) => wheelFileNameRegex.test(file));
  if (matchedFiles.length === 0) {
    throw new Error(
      "Streamlit wheel file not found in the build/wheels directory.",
    );
  }
  if (matchedFiles.length > 1) {
    throw new Error(
      "Multiple Streamlit wheel files found in the build/wheels directory.",
    );
  }

  return matchedFiles[0];
}

const streamlitWheelFileName = getStreamlitWheelFileName(); // TODO: This should be resolved and embedded into the bundle at build time, instead of resolved at runtime?

export default function vitePluginStliteReact(): Plugin {
  return {
    name: "vite-plugin-stlite-react",
    config: (config, { mode }) => ({
      resolve: {
        alias: {
          "stlite_lib.whl": path.resolve(
            REACT_PACKAGE_ROOT,
            "./build/wheels/stlite_lib-0.1.0-py3-none-any.whl",
          ),
          "streamlit.whl": path.resolve(
            REACT_PACKAGE_ROOT,
            `./build/wheels/${streamlitWheelFileName}`,
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
    }),
  };
}
