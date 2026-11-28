import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Stlite Browser Theme Font Faces Test", () => {
  // https://github.com/whitphx/stlite/issues/1932
  test("should load a theme.fontFaces font file served from app/static", async ({
    page,
  }) => {
    await page.goto("/theme-font-faces/index.html");

    await expect(
      page.locator('h1:has-text("Stlite Browser Theme Font Faces Test")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });

    // The font file is in the in-browser file system, so it must be loaded
    // through the kernel rather than requested from a (nonexistent) server.
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.fonts].some(
            (font) => font.family === "InterHosted" && font.status === "loaded",
          ),
        ),
      )
      .toBe(true);
  });
});
