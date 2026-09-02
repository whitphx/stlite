import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const useDevServer = !!process.env.USE_DEV_SERVER;
const buildDir = process.env.BUILD_DIR || "./demo-dist";

// Stlite tests require long timeouts because each one boots a fresh Pyodide:
// the worker downloads Pyodide and the wheels, imports Streamlit, and starts
// the server, which measures 30-45s per app in the Playwright Docker image and
// stretches further while the rest of the suite competes for the same CPU and
// network. Local runs go through that same container, so they get the same
// budget as CI rather than a shorter one.
const timeout = 180_000;
const expectTimeout = 120_000;

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
