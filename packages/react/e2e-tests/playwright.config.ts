import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const buildDir = process.env.BUILD_DIR || "../build";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to avoid resource contention
  forbidOnly: isCI,
  retries: 2, // Stlite loading can be flaky, retry failed tests
  workers: 1, // Single worker to avoid memory/resource issues with Pyodide
  timeout: 180_000, // 3 minutes - Stlite takes time to load
  expect: {
    timeout: 120_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02, // Allow up to 2% pixel difference for cross-browser/run variations
    },
  },
  reporter: isCI ? "blob" : "html",
  webServer: isCI
    ? {
        // In CI, serve the pre-built demos from BUILD_DIR using http-server
        command: `http-server '${buildDir}' -p 5173 --cors`,
        url: "http://localhost:5173",
        timeout: 30_000,
      }
    : {
        // In development, use vite dev server
        command: "yarn --cwd .. start",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120_000,
      },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  snapshotDir: "./snapshots",
});
