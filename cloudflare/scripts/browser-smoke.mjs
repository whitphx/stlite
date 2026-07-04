import { chromium } from "playwright";

const url = process.env.STLITE_CLOUDFLARE_URL ?? "http://127.0.0.1:8787/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (error) => errors.push(error.stack ?? error.message));

try {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });

  if (!response?.ok()) {
    throw new Error(`Expected HTTP 2xx from ${url}, got ${response?.status()}`);
  }

  await page.getByText("Welcome to Streamlit!").waitFor();
  await page.getByText("Select a demo from the sidebar").waitFor();
  await page.getByText("DataFrame demo", { exact: true }).waitFor();
  await page.getByText("Plotting demo", { exact: true }).waitFor();
  await page.getByText("Mapping demo", { exact: true }).waitFor();
  await page.getByText("Animation demo", { exact: true }).waitFor();

  const connectionState = await page
    .locator("[data-test-connection-state]")
    .getAttribute("data-test-connection-state");

  if (connectionState !== "CONNECTED") {
    throw new Error(`Expected CONNECTED, got ${connectionState}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n\n"));
  }
} finally {
  await browser.close();
}
