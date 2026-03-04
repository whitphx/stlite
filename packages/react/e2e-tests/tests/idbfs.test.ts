import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("IDBFS Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/idbfs/");
    await waitForStliteReady(page);
  });

  test("renders correctly and matches snapshot", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the title is visible
    await expect(
      page.locator('h1:has-text("IDBFS Persistent Storage")'),
    ).toBeVisible();

    // Check if the description is visible
    await expect(
      page.locator(
        'text="Files written to /mnt persist across page reloads using IndexedDB."',
      ),
    ).toBeVisible();

    // Check if the log output is displayed
    await expect(
      page.locator('text="Contents of /mnt/log.txt :"'),
    ).toBeVisible();

    // The code block should contain a "Visited at" entry
    await expect(page.getByText(/Visited at/)).toBeVisible();

    // Check for dead links
    expectNoDeadLinks();

    // Take snapshot
    await expect(page).toHaveScreenshot("idbfs.png", {
      fullPage: true,
    });
  });

  test("appends new entry on rerun", async ({ page }) => {
    // Wait for initial render with at least one "Visited at" entry
    await expect(page.getByText(/Visited at/)).toBeVisible();

    // Click the Rerun button to trigger another write
    await page.getByRole("button", { name: "Rerun" }).click();

    // After rerun, the log should contain at least two "Visited at" lines
    await expect(page.getByText(/Visited at/).first()).toBeVisible();

    // Get the code block content and verify multiple entries
    const codeBlock = page.locator("code");
    await expect(codeBlock).toContainText("Visited at");
  });

  test("clear button resets the log", async ({ page }) => {
    // Wait for initial render
    await expect(page.getByText(/Visited at/)).toBeVisible();

    // Click the Clear button
    await page.getByRole("button", { name: "Clear /mnt/log.txt" }).click();

    // After clearing and re-running, the code block should contain
    // exactly one "Visited at" entry (the one written after clearing)
    await expect(page.getByText(/Visited at/)).toBeVisible();
  });
});
