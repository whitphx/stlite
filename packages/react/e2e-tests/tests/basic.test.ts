import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("Basic Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/basic/");
    await waitForStliteReady(page);
  });

  test("smoke: renders without errors", async ({ page, expectNoDeadLinks }) => {
    // Check if the title is visible
    await expect(page.locator('h1:has-text("Hello, Stlite!")')).toBeVisible();

    // Check if the text input is visible
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();

    // Check if the default text is displayed
    await expect(
      page.locator('text="This app runs entirely in your browser."'),
    ).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();
  });

  test("interaction: text input updates greeting", async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();

    // Enter a name
    await textInput.fill("Playwright");
    await page.keyboard.press("Enter");

    // Check if the greeting is updated
    await expect(page.locator('text="Hello, Playwright!"')).toBeVisible();
  });

  test("snapshot: matches baseline", async ({ page }) => {
    // Wait for actual content to be rendered (same criteria as smoke test)
    await expect(page.locator('h1:has-text("Hello, Stlite!")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(
      page.locator('text="This app runs entirely in your browser."'),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("basic-app.png", {
      fullPage: true,
    });
  });
});
