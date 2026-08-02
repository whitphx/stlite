// Real-browser smoke for the minimal sample: the page renders over the
// Streamlit WebSocket session, the Worker-environment bridge surfaces the
// APP_MESSAGE var through st.secrets, and a widget interaction round-trips.
import { chromium } from "playwright";

const base = process.env.STLITE_CLOUDFLARE_URL ?? "http://127.0.0.1:8787/";
const timeout = Number(process.env.STLITE_SMOKE_TIMEOUT_MS ?? 120_000);

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByText("Bundled-runtime minimal app").waitFor({ timeout });
  await page.getByText("Configured via Cloudflare vars").waitFor({ timeout });
  await page.getByRole("button", { name: "Increment" }).click();
  await page
    .getByText("1", { exact: true })
    .first()
    .waitFor({ timeout: 30_000 });
  console.log("minimal smoke passed: render, st.secrets bridge, interaction");
} finally {
  await browser.close();
}
