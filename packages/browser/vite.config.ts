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
import { default as checker } from "vite-plugin-checker";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { viteStaticCopy } from "vite-plugin-static-copy";

import path from "node:path";
import fs from "node:fs";

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
    viteTsconfigPaths(),
    wasm(),
    topLevelAwait(),
    mode !== "test" &&
      viteStaticCopy({
        // Stlite is built with Vite's library-mode (https://vitejs.dev/guide/build.html#library-mode),
        // but the library mode enforces inlining of all the static file assets imported with the `import()` syntax,
        // while we need to disable inlining for the wheel files so that they are served as separate files
        // and their URLs are to be passed to `micropip.install()`.
        // Currently disabling inlining is not supported in the library mode:
        // > If you specify build.lib, build.assetsInlineLimit will be ignored and assets will always be inlined, regardless of file size or being a Git LFS placeholder.
        // > https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
        //
        // and there is an open issue about this: https://github.com/vitejs/vite/issues/4454.
        // So, we don't use the `import()` syntax for the wheel files and rely on Vite's static asset handling.
        // Instead, we copy the wheel files to the `dist` directory with the 'vite-plugin-static-copy' plugin
        // and construct the their URLs manually in `mount.tsx`.
        //
        // Ref: This workaround is introduced in https://github.com/vitejs/vite/issues/4454#issuecomment-1588713917
        targets: [
          {
            src: path.resolve(
              __dirname,
              "../kernel/py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
            ),
            dest: "wheels",
          },
          {
            src: path.resolve(
              __dirname,
              "../kernel/py/streamlit/lib/dist/streamlit-1.41.0-cp312-none-any.whl",
            ),
            dest: "wheels",
          },
        ],
      }),
    // this plugin checks for type errors on a separate process
    checker({
      typescript: true,
    }),
    // For development
    {
      name: "dev-data-server",
      configureServer(server) {
        server.middlewares.use("/dev-files", (req, res, next) => {
          if (req.method === "GET") {
            // ファイルパスを組み立てる
            const filePath = path.resolve(
              __dirname,
              "dev-files",
              req.url?.replace(/^\//, "") || "",
            );

            if (fs.existsSync(filePath)) {
              fs.createReadStream(filePath).pipe(res);
            } else {
              res.statusCode = 404;
              res.end("File not found");
            }
          } else {
            next();
          }
        });
      },
    },
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
    },
  },
  assetsInclude: ["**/*.whl"],
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
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Stlite",
      fileName: "stlite",
      formats: ["es"],
    },
  },
  test: {
    environment: "jsdom", // Same as the kernel
  },
}));
