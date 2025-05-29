/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { getStreamlitVersion } from "@stlite/devutils";

export default defineConfig(() => {
  const streamlitVersion = getStreamlitVersion();

  return {
    plugins: [react()],
    test: {
      environment: "jsdom", // We use jsdom because happy-dom does not work well with iframe.
      setupFiles: ["./setupTests.ts"],
      maxConcurrency: process.env.CI ? 3 : undefined,
    },
    resolve: {
      alias: {
        "stlite_lib.whl": path.resolve(
          __dirname,
          "./py/stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
        ),
        "streamlit.whl": path.resolve(
          __dirname,
          `./py/streamlit/lib/dist/streamlit-${streamlitVersion}-cp312-none-any.whl`,
        ),
      },
    },
    assetsInclude: ["**/*.whl"],
  };
});
