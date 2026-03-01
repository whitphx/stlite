import { test, expect, FIRST_VIEW_TIMEOUT } from "../test-utils";

test.describe("Multi-App Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/multi-app/index.html");

    // Wait for both apps to be loaded by checking for both app labels
    await expect(page.locator('text="App 1"')).toBeVisible({
      timeout: FIRST_VIEW_TIMEOUT,
    });
    await expect(page.locator('text="App 2"')).toBeVisible({
      timeout: FIRST_VIEW_TIMEOUT,
    });
  });

  test("renders both apps correctly", async ({ page, expectNoDeadLinks }) => {
    // Both should show "Hello, stlite!"
    const helloTexts = page.locator('text="Hello, stlite!"');
    await expect(helloTexts).toHaveCount(2);

    // Both should show the counter
    const counterTexts = page.getByText(/Counter: \d+/);
    await expect(counterTexts).toHaveCount(2);

    // Check for dead links
    expectNoDeadLinks();
  });

  test("counters work independently in each app", async ({ page }) => {
    // Get the two app containers
    const app1 = page.locator("#app1");
    const app2 = page.locator("#app2");

    // Verify initial counter values are 0
    await expect(app1.getByText("Counter: 0")).toBeVisible();
    await expect(app2.getByText("Counter: 0")).toBeVisible();

    // Click increment button in App 1
    await app1.getByRole("button", { name: "Increment counter" }).click();

    // Verify App 1's counter incremented to 1
    await expect(app1.getByText("Counter: 1")).toBeVisible();
    // Verify App 2's counter is still 0 (independent session state)
    await expect(app2.getByText("Counter: 0")).toBeVisible();

    // Click increment button in App 2
    await app2.getByRole("button", { name: "Increment counter" }).click();

    // Verify App 2's counter incremented to 1
    await expect(app2.getByText("Counter: 1")).toBeVisible();
    // Verify App 1's counter is still 1 (unchanged)
    await expect(app1.getByText("Counter: 1")).toBeVisible();

    // Click increment button in App 1 again
    await app1.getByRole("button", { name: "Increment counter" }).click();

    // Verify App 1's counter incremented to 2
    await expect(app1.getByText("Counter: 2")).toBeVisible();
    // Verify App 2's counter is still 1
    await expect(app2.getByText("Counter: 1")).toBeVisible();
  });
});
