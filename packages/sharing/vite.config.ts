import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc"
import { visualizer } from "rollup-plugin-visualizer";
import stliteReactPlugin from "@stlite/react/vite-plugin";

import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
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
