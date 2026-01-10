/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, Page } from "@playwright/test";

type ExpectNoDeadLinksFn = () => void;

export const test = base.extend<{
  expectNoDeadLinks: ExpectNoDeadLinksFn;
}>({
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

/**
 * Wait for the Stlite app container to be present.
 * Note: Tests should explicitly wait for specific content elements
 * before taking snapshots or performing assertions.
 */
export async function waitForStliteReady(
  page: Page,
  timeout = 120_000,
): Promise<void> {
  // Wait for the Streamlit app container to be visible
  await page.waitForSelector('[data-testid="stAppViewContainer"]', { timeout });
}

export { expect } from "@playwright/test";
