import path from "node:path";
import { test as base, expect, Page } from "@playwright/test";

type CustomizedPageWithDeadLinkDetection = {
  page: Page;
  expectNoDeadLinks: () => void;
};

export const test = base.extend<{
  customizedPageWithDeadLinkDetection: CustomizedPageWithDeadLinkDetection;
}>({
  customizedPageWithDeadLinkDetection: async ({ page, baseURL }, use) => {
    // Override page.goto to handle file: protocol correctly
    const originalGoto = page.goto.bind(page);
    page.goto = async (url, options) => {
      if (baseURL && new URL(baseURL).protocol === "file:") {
        // When using the file: protocol, "/foo.html" should be resolved to "file:///path/to/pages/foo.html"
        url = path.join(baseURL, url);
      }
      return originalGoto(url, options);
    };

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

    await use({ page, expectNoDeadLinks });
  },
});

export { expect } from "@playwright/test";
