import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("SharedWorker Mode Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shared-worker/");

    // First view: the title should be visible when the app is loaded
    await expect(
      page.locator('h1:has-text("SharedWorker Demo")'),
    ).toBeVisible({ timeout: FIRST_VIEW_TIMEOUT });
  });

  test("should load and render app in SharedWorker mode", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if the description is visible
    await expect(
      page.locator('text="This app runs in SharedWorker mode."'),
    ).toBeVisible();

    // Check if the button is visible
    const button = page.getByRole("button", { name: "Click me" });
    await expect(button).toBeVisible();

    // Check initial count
    await expect(
      page.locator('text="Button clicked 0 times"'),
    ).toBeVisible();

    // Click the button
    await button.click();

    // Check updated count
    await expect(
      page.locator('text="Button clicked 1 time"'),
    ).toBeVisible();

    // Click again
    await button.click();
    await expect(
      page.locator('text="Button clicked 2 times"'),
    ).toBeVisible();

    // Check for dead links
    await expectNoDeadLinks();
  });
});
