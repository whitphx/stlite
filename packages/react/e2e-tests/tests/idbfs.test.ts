import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("IDBFS Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/idbfs/");
    await waitForStliteReady(page);
  });

  test("renders correctly and matches snapshot", async ({ page }) => {
    // Check if the title is visible
    await expect(
      page.locator('h1:has-text("IDBFS Persistent Storage")'),
    ).toBeVisible();

    // Check if the description is visible (backticks render /mnt as <code>, so use regex)
    await expect(
      page.getByText(
        /Data written to.*\/mnt.*persists across page reloads using IndexedDB/,
      ),
    ).toBeVisible();

    // Check if the visit count is displayed (starts at 1 on fresh browser context)
    await expect(page.getByText("Visit count: 1")).toBeVisible();

    // Check if the reset button is visible
    await expect(
      page.getByRole("button", { name: "Reset counter" }),
    ).toBeVisible();

    // Take snapshot
    await expect(page).toHaveScreenshot("idbfs.png", {
      fullPage: true,
    });
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
