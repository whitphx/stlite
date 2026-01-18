import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Basic Stlite Browser Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/basic-mount/");

    // First view: the title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("Stlite Browser Test")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
  });

  test("should load and render the basic app correctly", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the text input is visible
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();

    // Check if the default greeting is displayed
    await expect(page.locator('text="Hello, world"')).toBeVisible();

    // Enter a name in the text input and hit the Enter key
    await textInput.fill("Playwright");
    await page.keyboard.press("Enter");

    // Check if the greeting is updated
    await expect(page.locator('text="Hello, Playwright"')).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });

  test("controller.runPython()", async ({ page }) => {
    const result = await page.evaluate(() => {
      // @ts-expect-error window.controller is injected in test-app.html
      return window.controller.runPython("12 + 34");
    });
    expect(result).toBe(46);
  });
});
