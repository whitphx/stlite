import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Stlite Browser Theme Font Test", () => {
  test("should render the app and load the stylesheet of a theme font given with a URL", async ({
    page,
  }) => {
    await page.goto("/theme-font/index.html");

    // The app used to crash before rendering when `theme.font` had a URL
    // because no <HelmetProvider> was mounted for Streamlit's <FontSources>.
    await expect(
      page.locator('h1:has-text("Stlite Browser Theme Font Test")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });

    await expect(
      page.locator(
        'head link[rel="stylesheet"][href^="https://fonts.googleapis.com/css2?family=Inter"]',
      ),
    ).toHaveCount(1);
  });
});
