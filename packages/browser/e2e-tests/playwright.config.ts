import { defineConfig, devices } from "@playwright/test";

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
      stdout: "pipe",
      url: "http://localhost:8080",
      ignoreHTTPSErrors: true,
    },
    {
      command: `http-server '${process.env.BUILD_DIR || "../build"}' -p 8081 --cors`,
      stdout: "pipe",
      url: "http://localhost:8081",
      ignoreHTTPSErrors: true,
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:8080",
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
});
