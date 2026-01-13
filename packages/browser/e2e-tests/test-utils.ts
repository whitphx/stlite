// Disable react-hooks/rules-of-hooks: Playwright's fixture `use()` function
// triggers a false positive (ESLint thinks it's React's `use` hook).
/* eslint-disable react-hooks/rules-of-hooks */

import path from "node:path";
import { pathToFileURL } from "node:url";
import { test as base, expect } from "@playwright/test";

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

type ExpectNoDeadLinksFn = () => void;

export const test = base.extend<{
  expectNoDeadLinks: ExpectNoDeadLinksFn;
}>({
  page: async ({ page, baseURL }, use) => {
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
  },
  expectNoDeadLinks: async ({ page }, use) => {
    // Set up dead link detection
    const failedRequests: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} - ${response.url()}`);
      }
    });
    const expectNoDeadLinks = () => {
      expect(
        failedRequests,
        `Found dead links: ${failedRequests.join(", ")}`,
      ).toHaveLength(0);
    };

    await use(expectNoDeadLinks);
  },
});

export { expect } from "@playwright/test";
