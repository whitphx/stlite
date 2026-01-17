import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Requirements Installation Test", () => {
  // Extended timeout for package installation
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/requirements/");

    // Wait for the app to load (longer timeout due to package installation)
    await expect(
      page.locator('h1:has-text("Requirements Demo")'),
    ).toBeVisible({ timeout: 120_000 });
  });

  test("should install and use packages", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the description is visible
    await expect(
      page.locator('text="This demo shows how to install Python packages."'),
    ).toBeVisible();

    // Check if the DataFrame is rendered (pandas was installed and used)
    await expect(
      page.locator('text="Here\'s a DataFrame created with pandas:"'),
    ).toBeVisible();

    // Check if the DataFrame contains expected data
    await expect(page.locator('text="Alice"')).toBeVisible();
    await expect(page.locator('text="Bob"')).toBeVisible();
    await expect(page.locator('text="Charlie"')).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();
  });
});
