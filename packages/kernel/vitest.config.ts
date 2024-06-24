/// <reference types="vitest" />

import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom", // We use jsdom because happy-dom does not work well with iframe.
    setupFiles: ["./setupTests.ts"],
    maxConcurrency: 4,
  },
  resolve: {
    alias: {
      "stlite_server.whl": path.resolve(
        __dirname,
        "./py/stlite-server/dist/stlite_server-0.1.0-py3-none-any.whl",
      ),
      "streamlit.whl": path.resolve(
        __dirname,
        "./py/streamlit/lib/dist/streamlit-1.35.0-cp312-none-any.whl",
      ),
    },
  },
  assetsInclude: ["**/*.whl"],
});
