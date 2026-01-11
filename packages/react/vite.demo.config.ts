/**
 * Vite configuration for building demo pages.
 * This builds the demo apps for E2E testing and preview deployments.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import wasm from "vite-plugin-wasm";

import path from "node:path";

export default defineConfig({
  base: "./",
  plugins: [
    react({
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    viteTsconfigPaths(),
    wasm(),
  ],
  build: {
    outDir: "demo-dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        basic: path.resolve(__dirname, "demos/basic/index.html"),
        "multi-app": path.resolve(__dirname, "demos/multi-app/index.html"),
        "shared-worker": path.resolve(
          __dirname,
          "demos/shared-worker/index.html",
        ),
      },
      // These are external in the lib build and handled by the stlite plugin
      external: ["stlite_lib.whl", "streamlit.whl"],
    },
  },
});
