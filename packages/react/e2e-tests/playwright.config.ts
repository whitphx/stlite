import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to avoid resource contention
  forbidOnly: !!process.env.CI,
  retries: 2, // Stlite loading can be flaky, retry failed tests
  workers: 1, // Single worker to avoid memory/resource issues with Pyodide
  timeout: 180_000, // 3 minutes - Stlite takes time to load
  expect: {
    timeout: 120_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02, // Allow up to 2% pixel difference for cross-browser/run variations
    },
  },
  reporter: process.env.CI ? "blob" : "html",
  webServer: {
    command: "yarn --cwd .. start",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
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
