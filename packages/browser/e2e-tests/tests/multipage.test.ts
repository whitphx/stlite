import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";
import type { Page } from "@playwright/test";

/**
 * Ensures the sidebar is expanded. On narrow viewports, the sidebar is collapsed
 * by default and needs to be expanded by clicking the collapse control button.
 */
async function ensureSidebarExpanded(page: Page): Promise<void> {
  const sidebarNav = page.locator('[data-testid="stSidebarNav"]');
  const expandSidebarButton = page.locator(
    '[data-testid="stExpandSidebarButton"]',
  );

  // First, wait briefly for the sidebar to become visible; if it does, no action needed
  try {
    await expect(sidebarNav).toBeVisible({ timeout: 2000 });
    return;
  } catch {
    // Sidebar did not become visible within the timeout; try expanding it via the collapse control.
  }

  // On narrow viewports, wait for the collapse control, click it to expand the sidebar,
  // then assert that the sidebar nav is visible.
  await expect(expandSidebarButton).toBeVisible({ timeout: 2000 });
  await expandSidebarButton.click();
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
