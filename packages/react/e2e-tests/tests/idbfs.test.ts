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

    // Check if the description is visible
    await expect(
      page.locator(
        'text="Files written to /mnt persist across page reloads using IndexedDB."',
      ),
    ).toBeVisible();

    // Check if the log output is displayed
    await expect(page.getByText(/Contents of.*\/mnt\/log\.txt/)).toBeVisible();

    // The code block should contain a "Visited at" entry
    await expect(page.getByText(/Visited at/)).toBeVisible();

    // Take snapshot
    await expect(page).toHaveScreenshot("idbfs.png", {
      fullPage: true,
    });
  });

  test("appends new entry on rerun", async ({ page }) => {
    // Wait for initial render with at least one "Visited at" entry
    const codeBlock = page.locator("code");
    await expect(codeBlock).toContainText("Visited at");

    // Capture the content before rerun
    const textBefore = await codeBlock.textContent();

    // Click the Rerun button to trigger another write
    await page.getByRole("button", { name: "Rerun" }).click();

    // After rerun, the code block content should have changed (new entry appended)
    await expect(codeBlock).not.toHaveText(textBefore!);

    // Verify there are now at least two "Visited at" lines
    const textAfter = await codeBlock.textContent();
    const lineCount = (textAfter!.match(/Visited at/g) || []).length;
    expect(lineCount).toBeGreaterThanOrEqual(2);
  });

  test("clear button resets the log", async ({ page }) => {
    // Wait for initial render
    const codeBlock = page.locator("code");
    await expect(codeBlock).toContainText("Visited at");

    // Click the Clear button
    await page.getByRole("button", { name: "Clear /mnt/log.txt" }).click();

    // After clearing and re-running, the code block should contain
    // exactly one "Visited at" entry (the one written after clearing)
    await expect(codeBlock).toContainText("Visited at");
    const textAfter = await codeBlock.textContent();
    const lineCount = (textAfter!.match(/Visited at/g) || []).length;
    expect(lineCount).toBe(1);
  });
});
