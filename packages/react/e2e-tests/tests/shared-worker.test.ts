import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("Shared Worker Demo", () => {
  // Skip SharedWorker tests on browsers that don't support it
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "SharedWorker is not fully supported in WebKit",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/shared-worker/");
    // Wait for both apps to be ready
    await waitForStliteReady(page);
  });

  test("smoke: renders both apps without errors", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if both apps are visible with their respective text
    await expect(page.locator('text="Shared Worker App 1"')).toBeVisible();
    await expect(page.locator('text="Shared Worker App 2"')).toBeVisible();

    // Both should show "Hello, stlite!"
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);

    // Both should show the shared counter
    const counterTexts = page.locator('text="Shared counter:"');
    await expect(counterTexts).toHaveCount(2);

    // Check for dead links
    expectNoDeadLinks();
  });

  test("snapshot: matches baseline", async ({ page }) => {
    // Wait for actual content to be rendered (same criteria as smoke test)
    await expect(page.locator('text="Shared Worker App 1"')).toBeVisible();
    await expect(page.locator('text="Shared Worker App 2"')).toBeVisible();
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);

    await expect(page).toHaveScreenshot("shared-worker.png", {
      fullPage: true,
    });
  });
});
