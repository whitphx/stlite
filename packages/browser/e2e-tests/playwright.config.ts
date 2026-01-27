import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = !!process.env.CI;

// Stlite tests require longer timeouts due to Pyodide loading time.
const timeout = 90_000;

const pagesDir = path.resolve(__dirname, "pages-dist");
const fileProtocolBaseURL = pathToFileURL(pagesDir).href + "/";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout,
  reporter: process.env.CI ? "blob" : "html",
  webServer: [
    {
      command: "http-server ./pages-dist -p 8080 --cors",
      url: "http://localhost:8080",
      ignoreHTTPSErrors: true,
    },
    {
      command: `http-server '${process.env.BUILD_DIR || "../build"}' -p 8081 --cors`,
      url: "http://localhost:8081",
      ignoreHTTPSErrors: true,
    },
  ],
  use: {
    baseURL: "http://localhost:8080",
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
    {
      name: "chromium-file-protocol",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: fileProtocolBaseURL,
      },
    },
    {
      name: "firefox-file-protocol",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: fileProtocolBaseURL,
      },
    },
    {
      name: "webkit-file-protocol",
      use: {
        ...devices["Desktop Safari"],
        baseURL: fileProtocolBaseURL,
      },
    },
  ],
});
