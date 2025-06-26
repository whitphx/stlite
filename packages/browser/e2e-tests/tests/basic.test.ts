import { test, expect } from "../test-utils";

test.describe("Basic Stlite Browser Test", () => {
  test("should load and render the basic app correctly", async ({
    pageWithDeadLinkDetection,
  }) => {
    const { page, expectNoDeadLinks } = pageWithDeadLinkDetection;

    // Navigate to the test page
    await page.goto("/test-app.html");

    // Wait for the Streamlit app to load
    // The title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("Stlite Browser Test")'),
    ).toBeVisible();

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
    expectNoDeadLinks();
  });
});
