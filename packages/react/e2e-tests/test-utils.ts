// Disable react-hooks/rules-of-hooks: Playwright's fixture `use()` function
// triggers a false positive (ESLint thinks it's React's `use` hook).
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
 *
 * Typical Stlite initialization times:
 * - Pyodide download + init: 10-30s (varies by network/caching)
 * - Python packages: 5-15s
 * - Streamlit startup: 5-10s
 *
 * Total expected: 20-55s. The 60s timeout provides buffer while still
 * catching hangs quickly. If this causes flakiness, investigate the
 * root cause before increasing the timeout.
 *
 * Note: Tests should explicitly wait for specific content elements
 * before taking snapshots or performing assertions.
 */
export async function waitForStliteReady(
  page: Page,
  timeout = 60_000,
): Promise<void> {
  await page.waitForSelector('[data-testid="stAppViewContainer"]', { timeout });
}

export { expect } from "@playwright/test";
