/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // We use jsdom because happy-dom does not work well with iframe.
    setupFiles: ["./setupTests.ts"],
  },
});
