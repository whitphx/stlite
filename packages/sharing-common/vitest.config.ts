/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // stlite-kernel uses jsdom, so use the same here too.
    typecheck: {
      enabled: true,
    },
  },
});
