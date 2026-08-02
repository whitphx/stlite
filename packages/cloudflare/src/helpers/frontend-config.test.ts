import assert from "node:assert/strict";
import { test } from "node:test";
import { injectFrontendConfig } from "./frontend-config.ts";

test("injectFrontendConfig inserts the config before the first module script", () => {
  const html =
    '<head><script type="module" src="./a.js"></script>' +
    '<script type="module" src="./b.js"></script></head>';

  const injected = injectFrontendConfig(html);

  const configAt = injected.indexOf("window.__streamlit");
  assert.notEqual(configAt, -1);
  assert.ok(configAt < injected.indexOf('<script type="module"'));
  // Only the first module script gets the prefix (BACKEND_BASE_URL appears
  // exactly once per injected config block).
  assert.equal(injected.match(/BACKEND_BASE_URL/g)?.length, 1);
});

test("injectFrontendConfig rejects HTML without the marker", () => {
  assert.throws(
    () => injectFrontendConfig("<head><script src=x></script></head>"),
    /MODULE_SCRIPT_MARKER/,
  );
});
