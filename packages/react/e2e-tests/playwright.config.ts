import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const useDevServer = !!process.env.USE_DEV_SERVER;
const buildDir = process.env.BUILD_DIR || "./demo-dist";

// Stlite tests require longer timeouts due to Pyodide loading time.
// CI uses longer timeouts for additional buffer.
const timeout = isCI ? 180_000 : 120_000;
const expectTimeout = isCI ? 120_000 : 60_000;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to avoid resource contention
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1, // Single worker to avoid memory/resource issues with Pyodide
  timeout,
  expect: {
    timeout: expectTimeout,
  },
  reporter: isCI ? "blob" : "html",
  webServer: useDevServer
    ? {
        // Use vite dev server (set USE_DEV_SERVER=1)
        command: "yarn --cwd .. start",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : {
        // Default: serve the pre-built demos from BUILD_DIR using http-server
        command: `http-server '${buildDir}' -p 5173 --cors`,
        url: "http://localhost:5173",
        timeout: 30_000,
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
