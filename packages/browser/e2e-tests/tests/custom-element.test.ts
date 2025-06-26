import { test, expect } from "../test-utils";

test.describe("Custom Element Stlite Browser Test", () => {
  test("should load and render the custom element app correctly", async ({
    pageWithDeadLinkDetection,
  }) => {
    const { page, expectNoDeadLinks } = pageWithDeadLinkDetection;

    // Navigate to the test page
    await page.goto("/test-app-custom-element.html");

    // Wait for the Streamlit app to load
    // The title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("Custom Element Test")'),
    ).toBeVisible();

    // Check if the selectbox is visible
    const selectbox = page.locator('input[role="combobox"]');
    await expect(selectbox).toBeVisible();

    // Check if the default option is displayed
    await expect(page.locator('text="You selected: Email"')).toBeVisible();

    // Click the selectbox to open the dropdown
    await selectbox.click();

    // Wait for the dropdown to appear
    await expect(
      page.locator('ul[data-testid="stSelectboxVirtualDropdown"]'),
    ).toBeVisible();

    // Select a different option
    await page.locator('li:has-text("Mobile phone")').click();

    // Check if the selection is updated
    await expect(
      page.locator('text="You selected: Mobile phone"'),
    ).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();
  });
});
