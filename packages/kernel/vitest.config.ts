/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true, // allows us to use vitest library methods in unit test without explicit imports
    environment: "jsdom", // We use jsdom because happy-dom does not work well with iframe.
    setupFiles: ["./setupTests.ts"],
  },
  assetsInclude: ["./py/*"],
});
