import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("Stlite Browser Env Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/env-test.html");
    await waitForStliteReady(page);
  });

  test("should correctly pass and display environment variables", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if custom environment variables are displayed correctly
    await expect(page.locator('text="TEST_VAR: test_value"')).toBeVisible();
    await expect(
      page.locator('text="ANOTHER_VAR: another_value"'),
    ).toBeVisible();

    // Check if the overridden PATH environment variable is displayed
    await expect(
      page.locator('text="PATH: /usr/local/bin:/usr/bin:/bin"'),
    ).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();
  });
});
