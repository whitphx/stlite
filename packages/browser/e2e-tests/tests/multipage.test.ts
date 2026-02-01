import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";
import type { Page } from "@playwright/test";

/**
 * Ensures the sidebar is expanded. On narrow viewports, the sidebar is collapsed
 * by default and needs to be expanded by clicking the sidebar expand button.
 */
async function ensureSidebarExpanded(page: Page): Promise<void> {
  const sidebarNav = page.locator('[data-testid="stSidebarNav"]');
  const expandSidebarButton = page.locator(
    '[data-testid="stExpandSidebarButton"]',
  );

  // If the sidebar is already visible, no action needed
  if (await sidebarNav.isVisible()) {
    return;
  }

  // On narrow viewports, click the expand button to show the sidebar
  await expandSidebarButton
    .waitFor({ state: "visible", timeout: 2000 })
    .then(() => expandSidebarButton.click());

  // Final verification that the sidebar is now visible
  await expect(sidebarNav).toBeVisible();
}

test.describe("Multipage App Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/multipage/index.html");

    // First view: the main page title should be visible when the app is loaded
    await expect(page.locator('h1:has-text("Main page")')).toBeVisible({
      timeout: FIRST_VIEW_TIMEOUT,
    });
  });

  test("should load and render the multipage app correctly", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the welcome message is visible
    await expect(
      page.locator('text="Welcome to the multipage app demo!"'),
    ).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });

  test("should navigate between pages", async ({ page, expectNoDeadLinks }) => {
    // Ensure sidebar is expanded (handles narrow viewports)
    await ensureSidebarExpanded(page);

    // Check sidebar navigation exists
    await expect(page.locator('[data-testid="stSidebarNav"]')).toBeVisible();

    // Navigate to Page 1
    await page.locator('a:has-text("Page1")').click();
    await expect(page.locator('h1:has-text("Page 1")')).toBeVisible();
    await expect(page.locator('text="This is the first page."')).toBeVisible();

    // Ensure sidebar is expanded after navigation (it may collapse on narrow viewports)
    await ensureSidebarExpanded(page);

    // Navigate to Page 2
    await page.locator('a:has-text("Page2")').click();
    await expect(page.locator('h1:has-text("Page 2")')).toBeVisible();
    await expect(page.locator('text="This is the second page."')).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });
});
