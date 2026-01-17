import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Multipage App Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/multipage/");

    // First view: the main page title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("Main page")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
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
    // Check sidebar navigation exists
    await expect(page.locator('[data-testid="stSidebarNav"]')).toBeVisible();

    // Navigate to Page 1
    await page.locator('a:has-text("Page1")').click();
    await expect(page.locator('h1:has-text("Page 1")')).toBeVisible();
    await expect(
      page.locator('text="This is the first page."'),
    ).toBeVisible();

    // Navigate to Page 2
    await page.locator('a:has-text("Page2")').click();
    await expect(page.locator('h1:has-text("Page 2")')).toBeVisible();
    await expect(
      page.locator('text="This is the second page."'),
    ).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });
});
