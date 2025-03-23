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
      command: "yarn serve:pages",
      url: "http://localhost:8080",
      ignoreHTTPSErrors: true,
    },
    {
      command: "yarn serve:build",
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
  ],
});
