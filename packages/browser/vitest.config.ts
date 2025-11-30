import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Same as the kernel
    exclude: ["e2e-tests/**"],
    typecheck: {
      enabled: true,
    },
  },
});
