import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("IDBFS Persistent Storage Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/idbfs/index.html");

    // First view: the title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("IDBFS Persistent Storage")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
  });

  test("renders correctly with visit count", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the description is visible
    await expect(
      page.locator(
        'text="Data written to /mnt persists across page reloads using IndexedDB."',
      ),
    ).toBeVisible();

    // Check if the visit count is displayed (starts at 1 on fresh browser context)
    await expect(page.getByText("Visit count: 1")).toBeVisible();

    // Check if the reset button is visible
    await expect(
      page.getByRole("button", { name: "Reset counter" }),
    ).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();
  });

  test("reset button resets the counter", async ({ page }) => {
    // Wait for initial render
    await expect(page.getByText("Visit count: 1")).toBeVisible();

    // Click the Reset button
    await page.getByRole("button", { name: "Reset counter" }).click();

    // After reset and rerun, the counter should be back to 1
    await expect(page.getByText("Visit count: 1")).toBeVisible();
  });
});
