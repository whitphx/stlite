import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildWranglerConfig } from "./wrangler-config.ts";

const base = { workerName: "test-worker", durableObject: false };

function build(options: Partial<Parameters<typeof buildWranglerConfig>[0]>) {
  return JSON.parse(buildWranglerConfig({ ...base, ...options }));
}

describe("buildWranglerConfig", () => {
  it("generates a complete config for a project without wrangler.jsonc", () => {
    const config = build({});
    assert.equal(config.name, "test-worker");
    assert.equal(config.main, "src/entry.py");
    assert.ok(config.compatibility_flags.includes("python_workers"));
    assert.ok(
      config.compatibility_flags.includes(
        "no_handle_cross_request_promise_resolution",
      ),
    );
    assert.equal(config.assets.binding, "ASSETS");
    assert.equal(config.assets.directory, "./assets");
    assert.equal(config.assets.not_found_handling, "single-page-application");
    assert.ok(config.assets.run_worker_first.includes("/_stlite/*"));
    assert.equal(config.limits.cpu_ms, 300000);
  });

  it("preserves user settings from a compatible custom config", () => {
    const config = build({
      customJsonc: `{
        // JSONC comments are accepted
        "name": "my-worker",
        "routes": [{ "pattern": "example.com/*", "zone_name": "example.com" }],
        "vars": { "MY_VAR": "value" },
        "observability": { "enabled": false },
        "limits": { "cpu_ms": 60000 },
      }`,
    });
    assert.equal(config.name, "my-worker");
    assert.equal(config.routes[0].pattern, "example.com/*");
    assert.equal(config.vars.MY_VAR, "value");
    assert.equal(config.observability.enabled, false);
    assert.equal(config.limits.cpu_ms, 60000);
    // Mandatory settings are still enforced on top.
    assert.equal(config.main, "src/entry.py");
    assert.ok(config.assets.run_worker_first.includes("/_stlite/*"));
  });

  it("fills in required fields a custom config omits", () => {
    const config = build({
      customJsonc: `{ "name": "partial", "compatibility_flags": ["nodejs_compat"] }`,
    });
    assert.deepEqual(
      new Set(config.compatibility_flags),
      new Set([
        "nodejs_compat",
        "python_workers",
        "no_handle_cross_request_promise_resolution",
      ]),
    );
    assert.equal(config.assets.binding, "ASSETS");
    assert.ok(config.assets.run_worker_first.includes("/_stcore/*"));
  });

  it("keeps user run_worker_first entries while adding the required ones", () => {
    const config = build({
      customJsonc: `{ "assets": { "run_worker_first": ["/api/*"] } }`,
    });
    assert.ok(config.assets.run_worker_first.includes("/api/*"));
    assert.ok(config.assets.run_worker_first.includes("/_stlite/*"));
  });

  it("rejects a conflicting main module", () => {
    assert.throws(
      () => build({ customJsonc: `{ "main": "src/index.js" }` }),
      /"main" must be "src\/entry\.py"/,
    );
  });

  it("rejects a conflicting assets binding or directory", () => {
    assert.throws(
      () => build({ customJsonc: `{ "assets": { "binding": "FILES" } }` }),
      /"assets\.binding" must be "ASSETS"/,
    );
    assert.throws(
      () => build({ customJsonc: `{ "assets": { "directory": "./public" } }` }),
      /"assets\.directory" must be "\.\/assets"/,
    );
  });

  it("rejects malformed JSONC", () => {
    assert.throws(
      () => build({ customJsonc: "{ not json" }),
      /parsed as JSONC/,
    );
  });

  it("adds the Durable Object binding and migration in DO mode", () => {
    const config = build({ durableObject: true });
    assert.deepEqual(config.durable_objects.bindings, [
      { name: "STLITE_SERVER", class_name: "StliteServer" },
    ]);
    assert.deepEqual(config.migrations, [
      { tag: "stlite-v1", new_sqlite_classes: ["StliteServer"] },
    ]);
  });

  it("merges DO settings into a custom config without duplicating them", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{
        "durable_objects": { "bindings": [
          { "name": "MY_DO", "class_name": "MyThing" },
          { "name": "STLITE_SERVER", "class_name": "StliteServer" },
        ] },
        "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyThing", "StliteServer"] }],
      }`,
    });
    assert.equal(config.durable_objects.bindings.length, 2);
    assert.equal(config.migrations.length, 1);
  });

  it("rejects an STLITE_SERVER binding pointing at another class", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "durable_objects": { "bindings": [
            { "name": "STLITE_SERVER", "class_name": "Other" },
          ] } }`,
        }),
      /must point at class "StliteServer"/,
    );
  });
});
