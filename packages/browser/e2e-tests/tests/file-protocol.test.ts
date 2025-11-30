import path from "node:path";
import { pathToFileURL } from "node:url";
import { test, expect } from "../test-utils";

const fileProtocolPageUrl = pathToFileURL(
  path.resolve(__dirname, "../pages/test-app.html"),
).href;

test.describe("File Protocol Stlite Browser Test", () => {
  test("should load correctly when opened via file://", async ({
    pageWithDeadLinkDetection,
  }) => {
    const { page, expectNoDeadLinks } = pageWithDeadLinkDetection;

    await page.goto(fileProtocolPageUrl);

    // Verify the page is loaded via the file scheme
    expect(page.url().startsWith("file://")).toBe(true);

    await expect(
      page.locator('h1:has-text("Stlite Browser Test")'),
    ).toBeVisible();

    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();
    await expect(page.locator('text="Hello, world"')).toBeVisible();

    await textInput.fill("Playwright File");
    await page.keyboard.press("Enter");
    await expect(
      page.locator('text="Hello, Playwright File"'),
    ).toBeVisible();

    await page.waitForFunction(() => {
      // @ts-expect-error window.controller is injected in the page
      return typeof window.controller?.runPython === "function";
    });

    const result = await page.evaluate(() => {
      // @ts-expect-error window.controller is injected in the page
      return window.controller.runPython("6 * 7");
    });
    expect(result).toBe(42);

    expectNoDeadLinks();
  });
});
