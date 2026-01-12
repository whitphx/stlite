import { test, expect, waitForStliteReady } from "../test-utils";

test.describe("Shared Worker Demo", () => {
  // Skip on Playwright's WebKit - SharedWorker works in real Safari but
  // Playwright's WebKit build has issues with it. This is a test environment
  // limitation, not a browser compatibility issue.
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "SharedWorker not working in Playwright's WebKit (works in real Safari)",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/demos/shared-worker/");
    // Wait for both apps to be ready
    await waitForStliteReady(page);
  });

  test("smoke: renders both apps without errors", async ({
    page,
    expectNoDeadLinks,
  }) => {
    // Check if both apps are visible with their respective text
    await expect(page.locator('text="Shared Worker App 1"')).toBeVisible();
    await expect(page.locator('text="Shared Worker App 2"')).toBeVisible();

    // Both should show "Hello, stlite!"
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);

    // Both should show the shared counter (text includes the count value)
    const counterTexts = page.getByText(/Shared counter: \d+/);
    await expect(counterTexts).toHaveCount(2);

    // Check for dead links
    expectNoDeadLinks();
  });

  test("snapshot: matches baseline", async ({ page }) => {
    // Wait for actual content to be rendered (same criteria as smoke test)
    await expect(page.locator('text="Shared Worker App 1"')).toBeVisible();
    await expect(page.locator('text="Shared Worker App 2"')).toBeVisible();
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);
    const counterTexts = page.getByText(/Shared counter: \d+/);
    await expect(counterTexts).toHaveCount(2);

    await expect(page).toHaveScreenshot("shared-worker.png", {
      fullPage: true,
    });
  });

  test("counters work independently in each app", async ({ page }) => {
    // Wait for both apps to be fully rendered
    await expect(page.locator('text="Shared Worker App 1"')).toBeVisible();
    await expect(page.locator('text="Shared Worker App 2"')).toBeVisible();

    // Get the two app containers (left and right)
    const apps = page.locator('div[style*="flex: 1"]');
    const app1 = apps.nth(0);
    const app2 = apps.nth(1);

    // Verify initial counter values are 0
    await expect(app1.getByText("Shared counter: 0")).toBeVisible();
    await expect(app2.getByText("Shared counter: 0")).toBeVisible();

    // Click increment button in App 1
    await app1
      .getByRole("button", { name: "Increment shared counter" })
      .click();

    // Verify App 1's counter incremented to 1
    await expect(app1.getByText("Shared counter: 1")).toBeVisible();
    // Verify App 2's counter is still 0
    await expect(app2.getByText("Shared counter: 0")).toBeVisible();

    // Click increment button in App 2
    await app2
      .getByRole("button", { name: "Increment shared counter" })
      .click();

    // Verify App 2's counter incremented to 1
    await expect(app2.getByText("Shared counter: 1")).toBeVisible();
    // Verify App 1's counter is still 1 (unchanged)
    await expect(app1.getByText("Shared counter: 1")).toBeVisible();

    // Click increment button in App 1 again
    await app1
      .getByRole("button", { name: "Increment shared counter" })
      .click();

    // Verify App 1's counter incremented to 2
    await expect(app1.getByText("Shared counter: 2")).toBeVisible();
    // Verify App 2's counter is still 1
    await expect(app2.getByText("Shared counter: 1")).toBeVisible();
  });
});
