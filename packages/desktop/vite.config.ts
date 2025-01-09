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

import path from "path";

const BUILD_AS_FAST_AS_POSSIBLE =
  process.env.BUILD_AS_FAST_AS_POSSIBLE || false;

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [
    react({
      //   jsxImportSource: "@emotion/react",
      //   plugins: [["@swc/plugin-emotion", {}]],
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    viteTsconfigPaths(),
    wasm(),
    topLevelAwait(),
    // this plugin checks for type errors on a separate process
    checker({
      typescript: true,
    }),
    {
      name: "inject-csp-header",
      transformIndexHtml(html) {
        const cspSourceForMap =
          "https://data.streamlit.io/ https://*.mapbox.com/";
        const csp = [
          "default-src 'self'",
          // - 'wasm-unsafe-eval': For the Wasm code. Ref: https://chromestatus.com/feature/5499765773041664, https://github.com/WebAssembly/content-security-policy/issues/7
          // - 'unsafe-eval': For some components such as st.*_chart() or custom components such as streamlit_hiplot. Electron shows a warning about it, but we have to use this policy...
          "script-src 'wasm-unsafe-eval' 'unsafe-eval'",
          // style-src is necessary because of emotion. In dev, style-loader with injectType=styleTag is also the reason.
          "style-src 'self' 'unsafe-inline'",
          // - 'self': The stlite kernel worker is bundled as a separate file via Vite's worker feature.
          // - blob: : Some third party libraries such as Mapbox used in st.map() create workers from blob.
          "worker-src 'self' blob:",
          // For <script /> tag permissions.
          // - 'self': The main scripts
          // - 'unsafe-inline': Allow the inline scripts from custom components
          // - https: : Custom components may load arbitrary third party scripts from the Internet. We only allow HTTPS for a security sake.
          "script-src-elem 'self' 'unsafe-inline' https:",
          // For stylesheets.
          // - 'self': For the stylesheet files bundled with the core.
          // - 'unsafe-inline': The core frontend uses some inline stylesheets.
          // - https: : Custom components may load arbitrary remote stylesheets, e.g. streamlit_folium.
          "style-src-elem 'self' 'unsafe-inline' https:",
          // - 'self': For font files bundled with Streamlit core, for example, for `st.latex()`.
          // - data: : Some custom components load fonts through `data:` scheme, e.g. streamlit_aggrid.
          // - https: : Some custom components load fonts from remote via HTTPS, e.g. streamlit_folium.
          "font-src 'self' data: https:",
          // For loading external resources, such as the hosted Pyodide files, wheels, and some remote resources
          // - https: : Allow fetch() and XMLHttpRequest to load any resources via HTTPS.
          // - data: : `st.camera_input()` calls `fetch()` with the data: scheme when loading the preview image (while `data:` is not recommended to use for security reasons though).
          mode === "production" &&
            `connect-src ${cspSourceForMap} 'self' https: data:`,
          mode === "development" &&
            `connect-src ${cspSourceForMap} https://cdn.jsdelivr.net/ https://pypi.org/ https://files.pythonhosted.org/ http://localhost:3000/ ws://localhost:3000/ https: data:`,
          // Allow <img> to load any resources.
          // - blob: : For st.pyplot
          // - data: : For st.map
          // - file: : For some built-in image files such as the loading GIF animation and images for st.balloon(). TODO: We wanted to restrict the
          "img-src https: blob: data: file:",
          // Allow <audio> and <video> to load any resources.
          "media-src https: blob:",
          // For iframe sources.
          // `st.video()` creates an iframe for a YouTube video loading resources from https://*.youtube.com.
          // In addition, custom components may create iframes loading arbitrary external resources. We allow only HTTPS for a security sake..
          "frame-src https:",
        ]
          .filter(Boolean)
          .join("; ");

        return html.replace(
          /<head>/,
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">`,
        );
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
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[hash][extname]`, // The dot before the hash is important to make the wheel file names correct and installable
      },
    },
  },
}));
