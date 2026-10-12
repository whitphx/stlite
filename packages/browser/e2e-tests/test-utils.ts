// Disable react-hooks/rules-of-hooks: Playwright's fixture `use()` function
// triggers a false positive (ESLint thinks it's React's `use` hook).
/* eslint-disable react-hooks/rules-of-hooks */

import path from "node:path";
import { pathToFileURL } from "node:url";
import { test as base, expect } from "@playwright/test";

export const FIRST_VIEW_TIMEOUT = 60_000;

function urlOnlyHasPathAndQuery(url: string): boolean {
  try {
    new URL(url);

    // e.g. "http://example.com/path"
    return false;
  } catch {
    // e.g. "/path"
    return true;
  }
}

export const test = base.extend<{
  expectNoDeadLinks: void;
}>({
  page: async ({ page, baseURL }, use, testInfo) => {
    // Keep the browser console so that a failure reports what the page and
    // the kernel worker logged: the traces and screenshots only reach those
    // who can download the CI artifacts.
    const consoleLines: string[] = [];
    page.on("console", (message) =>
      consoleLines.push(`[${message.type()}] ${message.text()}`),
    );
    page.on("pageerror", (error) =>
      consoleLines.push(`[pageerror] ${error.message}`),
    );

    // Override page.goto to handle file: protocol correctly
    const originalGoto = page.goto.bind(page);
    page.goto = async (url, options) => {
      if (
        baseURL &&
        new URL(baseURL).protocol === "file:" &&
        urlOnlyHasPathAndQuery(url)
      ) {
        // When using the file: protocol, "/foo.html" should be resolved to "file:///path/to/pages/foo.html"
        const basePath = new URL(baseURL).pathname;
        const resolvedPath = path.join(basePath, url);
        url = pathToFileURL(resolvedPath).href;
      }
      return originalGoto(url, options);
    };

    await use(page);

    page.goto = originalGoto;

    if (testInfo.status !== testInfo.expectedStatus) {
      // Thrown rather than logged so that it shows up next to the test's
      // own error in every reporter, including the blob reporter CI uses.
      const lastLines = consoleLines
        .slice(-50)
        .map((line) => (line.length > 500 ? `${line.slice(0, 500)}…` : line));
      throw new Error(
        `Browser console output of the failed test (last ${lastLines.length} of ${consoleLines.length} lines):\n${lastLines.join("\n")}`,
      );
    }
  },
  expectNoDeadLinks: [
    async ({ page }, use) => {
      // Set up dead link detection
      const failedRequests: string[] = [];
      page.on("response", (response) => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.status()} - ${response.url()}`);
        }
      });

      await use();

      expect(
        failedRequests,
        `Found dead links: ${failedRequests.join(", ")}`,
      ).toHaveLength(0);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
