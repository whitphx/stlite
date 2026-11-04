import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc"
import { visualizer } from "rollup-plugin-visualizer";
import stliteReactPlugin from "@stlite/react/vite-plugin";

import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // `@stlite/react` is a workspace package, so its prebuilt bundle resolves to
      // packages/react/build/, not under the node_modules/ the default `exclude`
      // skips. Babel would re-parse and reprint that whole bundle, for about half
      // a minute of this build, without changing what the code does: the Emotion
      // plugin already ran when @stlite/react was built.
      exclude: [/\/node_modules\//, /\/packages\/react\/build\//],
      // jsxImportSource: "@emotion/react",
      // plugins: [["@swc/plugin-emotion", {}]],
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    stliteReactPlugin(),
    mode === "production" &&
      visualizer({
        filename: path.resolve(__dirname, "stats/sharing.html"),
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
      }),
  ],
  define: {
    EDITOR_APP_ORIGIN: JSON.stringify(process.env.EDITOR_APP_ORIGIN),
    EDITOR_APP_ORIGIN_REGEX: JSON.stringify(
      process.env.EDITOR_APP_ORIGIN_REGEX,
    ),
  },
  server: {
    open: false,
    port: 3000,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
}));
