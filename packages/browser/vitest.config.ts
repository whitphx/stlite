import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Same as the kernel
    exclude: ["**/node_modules/**", "e2e-tests/**"],
    typecheck: {
      enabled: true,
    },
  },
});
