import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

// Skip for file:// protocol - IndexedDB is not available on opaque origins
test.describe("IDBFS Persistent Storage Test", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name.includes("file-protocol"),
      "IDBFS requires IndexedDB which is not available on file:// origins",
    );

    await page.goto("/idbfs/index.html");

    // First view: the title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("IDBFS Persistent Storage")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
  });

  test("renders correctly with visit count", async ({ page }) => {
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
  });

  test("visit counter increments on page reload", async ({ page }) => {
    // First visit: counter should be 1
    await expect(page.getByText("Visit count: 1")).toBeVisible();

    // Reload the page to trigger a second visit
    await page.reload();
    await expect(
      page.locator('h1:has-text("IDBFS Persistent Storage")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });

    // Second visit: counter should be 2 (persisted via IDBFS)
    await expect(page.getByText("Visit count: 2")).toBeVisible();
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
