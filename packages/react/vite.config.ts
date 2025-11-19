/**
 * Copyright (c) Yuichiro Tachibana (Tsuchiya) (2022-2024)
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2024)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc"
import viteTsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";
import dts from "vite-plugin-dts";

import path from "node:path";
import { getStreamlitWheelFileName } from "@stlite/devutils";

const BUILD_AS_FAST_AS_POSSIBLE =
  process.env.BUILD_AS_FAST_AS_POSSIBLE || false;

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react({
      // jsxImportSource: "@emotion/react",
      // plugins: [["@swc/plugin-emotion", {}]],
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    dts({
      rollupTypes: true,
      bundledPackages: [
        // "@stlite/kernel",
        // "@stlite/common-react",
        // "@streamlit/lib",
        // "pyodide",
      ],
    }),
    viteTsconfigPaths(),
    wasm(),
    // Stlite is built with Vite's library-mode (https://vitejs.dev/guide/build.html#library-mode),
    // but the library mode enforces inlining of all the static file assets imported with the `import()` syntax,
    // while we need to disable inlining for the wheel files so that they are served as separate files
    // and their URLs are to be passed to `micropip.install()`.
    // Currently disabling inlining is not supported in the library mode:
    // > If you specify build.lib, build.assetsInlineLimit will be ignored and assets will always be inlined, regardless of file size or being a Git LFS placeholder.
    // > https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    //
    // and there is an open issue about this: https://github.com/vitejs/vite/issues/4454.
    //
    // As a workaround, we use this 'vite-plugin-lib-assets' plugin to avoid inlining of the wheel files,
    // that was introduced in the above issue discussion as well (https://github.com/vitejs/vite/issues/4454#issuecomment-1627702924)
    libAssetsPlugin({
      include: "**/*.whl",
      outputPath: "wheels",
      // Ensure that *.whl files have proper file names following the wheel file name convention
      // defined in https://packaging.python.org/en/latest/specifications/binary-distribution-format/#file-name-convention
      // so that micropip can recognize them correctly.
      name: "[name].[ext]",
      publicUrl: "./",
    }),
  ],
  resolve: {
    alias: {
      "@streamlit/lib/src": path.resolve(
        __dirname,
        "../../streamlit/frontend/lib/src",
      ),
      "@streamlit/lib": path.resolve(
        __dirname,
        "../../streamlit/frontend/lib/src",
      ),
      "stlite_lib.whl": path.resolve(
        __dirname,
        "../kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
      ),
      "streamlit.whl": path.resolve(
        __dirname,
        `../kernel/py/streamlit/lib/dist/${getStreamlitWheelFileName()}`,
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
  server: {
    open: false,
    port: 3000,
    fs: {
      allow: ["../.."],
    },
  },
  build: {
    outDir: "build",
    sourcemap: !BUILD_AS_FAST_AS_POSSIBLE,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Stlite",
      fileName: "stlite",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
}));
