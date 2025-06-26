import { test as base, expect, Page } from "@playwright/test";

type PageWithDeadLinkDetection = {
  page: Page;
  expectNoDeadLinks: () => void;
};

export const test = base.extend<{
  pageWithDeadLinkDetection: PageWithDeadLinkDetection;
}>({
  pageWithDeadLinkDetection: async ({ page }, use) => {
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
