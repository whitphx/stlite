import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Stlite Browser Env Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/env-variables/");

    // First view: wait for the Streamlit app to load
    await expect(
      page.locator('h1:has-text("Stlite Browser Env Test")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
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
