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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc"
import viteTsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

import path from "path";

const BUILD_AS_FAST_AS_POSSIBLE =
  process.env.BUILD_AS_FAST_AS_POSSIBLE || false;

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // jsxImportSource: "@emotion/react",
      // plugins: [["@swc/plugin-emotion", {}]],
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    viteTsconfigPaths(),
    wasm(),
    topLevelAwait(),
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
        "../kernel/py/streamlit/lib/dist/streamlit-1.44.1-cp312-none-any.whl",
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
    EDITOR_APP_ORIGIN: JSON.stringify(process.env.EDITOR_APP_ORIGIN),
    EDITOR_APP_ORIGIN_REGEX: JSON.stringify(
      process.env.EDITOR_APP_ORIGIN_REGEX,
    ),
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
    rollupOptions: {
      output: {
        // Ensure that *.whl files don't include the hash part to comply with the file name convention
        // defined in https://packaging.python.org/en/latest/specifications/binary-distribution-format/#file-name-convention.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".whl")) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
}));
