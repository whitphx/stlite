import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const pagesDir = path.resolve(__dirname, "pages");
const fileProtocolBaseURL = pathToFileURL(pagesDir + path.sep).href;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : undefined,
  expect: {
    timeout: process.env.CI ? 60_000 : undefined,
  },
  reporter: "html",
  webServer: [
    {
      command: "http-server ./pages -p 8080 --cors",
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
