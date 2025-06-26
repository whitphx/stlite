import { test, expect } from "../test-utils";

test.describe("Stlite Browser Env Test", () => {
  test("should correctly pass and display environment variables", async ({
    pageWithDeadLinkDetection,
  }) => {
    const { page, expectNoDeadLinks } = pageWithDeadLinkDetection;

    // Navigate to the test page
    await page.goto("/env-test.html");

    // Wait for the Streamlit app to load
    await expect(
      page.locator('h1:has-text("Stlite Browser Env Test")'),
    ).toBeVisible();

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
