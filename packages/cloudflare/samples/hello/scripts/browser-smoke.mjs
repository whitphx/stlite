import { chromium } from "playwright";

const url = process.env.STLITE_CLOUDFLARE_URL ?? "http://127.0.0.1:8787/";
// The Worker cold-boots Pyodide on the first request, which can take well over
// Playwright's 30s default on slow machines (CI); make the budget tunable.
const timeoutMs = Number(process.env.STLITE_SMOKE_TIMEOUT_MS ?? 30_000);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(timeoutMs);
page.setDefaultNavigationTimeout(timeoutMs);

const errors = [];
page.on("pageerror", (error) => errors.push(error.stack ?? error.message));

async function expectNoExceptions(pageName) {
  const exceptionCount = await page
    .locator('[data-testid="stException"]')
    .count();
  if (exceptionCount !== 0) {
    throw new Error(`${pageName} rendered ${exceptionCount} exception(s)`);
  }
}

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

  // Open pages whose scripts pull in extra dependency chains — a menu-only
  // check misses import-time breakage (native .so loading, pruned modules).
  // DataFrame: numpy/pandas/altair. Mapping: pydeck. The waited-for fragments
  // are per-page (a shared prefix would match the previous page's still-
  // mounted text) and avoid `code`-rendered spans.
  await page.getByText("DataFrame demo", { exact: true }).click();
  await page
    .getByText("to visualize a Pandas DataFrame", { exact: false })
    .waitFor();
  // The subheader above the dataframe renders only after the page has read
  // ./agri.csv.gz out of the packaged app, so it is what proves the app's
  // data files survive into the deployed Worker. The demo's own `except`
  // clause covers URLError only, so a failed read would surface as an
  // uncaught exception rather than a missing element. Matching exactly keeps
  // this off the same string in the source listing show_code() renders below
  // it, where the highlighted literal carries its quotes.
  await page
    .getByText("Gross agricultural production ($B)", { exact: true })
    .waitFor();
  // The Worker ships without pyarrow; arrow-ipc-writer serializes the
  // dataframe and the chart's data in its place. The grid's accessible table
  // carries the headers and cells the frontend decoded from that Arrow
  // stream, so a year column and a selected region in it prove the stream
  // was read; and no exception element may be left on the page.
  const dataframe = page.locator('[data-testid="stDataFrame"]');
  await dataframe.getByRole("columnheader", { name: "1961" }).waitFor();
  await dataframe.getByRole("gridcell", { name: "China" }).waitFor();
  await page
    .locator('[data-testid="stVegaLiteChart"]')
    .locator("canvas, svg")
    .first()
    .waitFor();
  await expectNoExceptions("DataFrame demo");

  // The Plotting demo redraws its line chart 50 times, serializing the
  // growing data through Arrow each time; the sidebar reaches 100% only after
  // the last redraw.
  await page.getByText("Plotting demo", { exact: true }).click();
  await page.getByText("100% complete", { exact: true }).waitFor();
  await page
    .locator('[data-testid="stVegaLiteChart"]')
    .locator("canvas, svg")
    .first()
    .waitFor();
  await expectNoExceptions("Plotting demo");

  await page.getByText("Mapping demo", { exact: true }).click();
  await page
    .getByText("to display geospatial data", { exact: false })
    .waitFor();

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
