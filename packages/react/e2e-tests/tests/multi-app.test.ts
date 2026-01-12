import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("Multi-App Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/multi-app/");
    // Wait for both apps to be ready
    await waitForStliteReady(page);
  });

  test("renders both apps correctly and matches snapshot", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if both apps are visible with their respective text
    await expect(page.locator('text="App 1"')).toBeVisible();
    await expect(page.locator('text="App 2"')).toBeVisible();

    // Both should show "Hello, stlite!"
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);

    // Check for dead links
    expectNoDeadLinks();

    // Take snapshot
    await expect(page).toHaveScreenshot("multi-app.png", {
      fullPage: true,
    });
  });
});
