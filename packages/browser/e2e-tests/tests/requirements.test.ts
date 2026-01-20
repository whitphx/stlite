import { test, expect } from "../test-utils";

test.describe("Requirements Installation Test", () => {
  // Extended timeout for package installation
  test.setTimeout(180_000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/requirements/");

    // Wait for the app to load (longer timeout due to package installation)
    await expect(page.locator('h1:has-text("Requirements Demo")')).toBeVisible({
      timeout: 120_000,
    });
  });

  test("should install and use packages", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the description is visible
    await expect(
      page.locator('text="This demo shows how to install Python packages."'),
    ).toBeVisible();

    // Check if Faker examples subheader is visible
    await expect(page.locator('text="Faker Examples"')).toBeVisible();

    // Check if Faker output is rendered (faker was installed and used)
    // With seed 12345, the output is deterministic
    await expect(page.locator("text=/^Name:/")).toBeVisible();
    await expect(page.locator("text=/^Email:/")).toBeVisible();
    await expect(page.locator("text=/^Address:/")).toBeVisible();
    await expect(page.locator("text=/^Company:/")).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });
});
