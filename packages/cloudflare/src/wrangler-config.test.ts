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
});

describe("run_worker_first merging", () => {
  it("preserves boolean true, which routes everything to the Worker", () => {
    const config = build({
      customJsonc: `{ "assets": { "run_worker_first": true } }`,
    });
    assert.equal(config.assets.run_worker_first, true);
  });

  it("rejects boolean false", () => {
    assert.throws(
      () =>
        build({ customJsonc: `{ "assets": { "run_worker_first": false } }` }),
      /must not be false/,
    );
  });

  it("keeps compatible custom arrays and appends the required routes", () => {
    const config = build({
      customJsonc: `{ "assets": { "run_worker_first": ["/api/*"] } }`,
    });
    assert.ok(config.assets.run_worker_first.includes("/api/*"));
    for (const route of [
      "/_stcore/*",
      "/media/*",
      "/component/*",
      "/app/static/*",
      "/_stlite/*",
    ]) {
      assert.ok(config.assets.run_worker_first.includes(route));
    }
  });

  it("rejects exception patterns targeting protected namespaces", () => {
    for (const pattern of [
      "!/_stlite/*",
      "!/_stcore/*",
      "!/*",
      "!/media/logo.png",
      "!/app/*",
    ]) {
      assert.throws(
        () =>
          build({
            customJsonc: `{ "assets": { "run_worker_first": [${JSON.stringify(pattern)}] } }`,
          }),
        /exception pattern/,
        `expected rejection for ${pattern}`,
      );
    }
  });

  it("keeps mixed positive and unrelated exception patterns", () => {
    const config = build({
      customJsonc: `{ "assets": { "run_worker_first": ["/api/*", "!/api/docs/*"] } }`,
    });
    assert.ok(config.assets.run_worker_first.includes("/api/*"));
    assert.ok(config.assets.run_worker_first.includes("!/api/docs/*"));
    assert.ok(config.assets.run_worker_first.includes("/_stlite/*"));
  });
});

describe("named environments", () => {
  it("adds the non-inherited Durable Object binding to every environment", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "env": { "staging": { "vars": { "STAGE": "1" } } } }`,
    });
    assert.deepEqual(config.env.staging.durable_objects.bindings, [
      { name: "STLITE_SERVER", class_name: "StliteServer" },
    ]);
    // Environment-specific user settings survive.
    assert.equal(config.env.staging.vars.STAGE, "1");
    // The class declaration stays top-level.
    assert.equal(config.migrations.length, 1);
  });

  it("leaves plain-worker environments without Durable Object config", () => {
    const config = build({
      customJsonc: `{ "env": { "staging": { "routes": [{ "pattern": "stg.example.com/*", "zone_name": "example.com" }] } } }`,
    });
    assert.equal(config.env.staging.durable_objects, undefined);
    assert.equal(config.env.staging.routes[0].pattern, "stg.example.com/*");
  });

  it("rejects a conflicting environment main", () => {
    assert.throws(
      () =>
        build({
          customJsonc: `{ "env": { "staging": { "main": "src/other.py" } } }`,
        }),
      /"env\.staging\.main" must be "src\/entry\.py"/,
    );
  });

  it("validates an environment assets override like the top level", () => {
    assert.throws(
      () =>
        build({
          customJsonc: `{ "env": { "staging": { "assets": { "binding": "FILES" } } } }`,
        }),
      /"env\.staging\.assets\.binding" must be "ASSETS"/,
    );
  });

  it("rejects a protected exception pattern inside an environment", () => {
    assert.throws(
      () =>
        build({
          customJsonc: `{ "env": { "staging": { "assets": { "run_worker_first": ["!/_stlite/*"] } } } }`,
        }),
      /env\.staging\.assets\.run_worker_first/,
    );
  });

  it("merges required compatibility flags into environment overrides", () => {
    const config = build({
      customJsonc: `{ "env": { "staging": { "compatibility_flags": ["nodejs_compat"] } } }`,
    });
    assert.ok(
      config.env.staging.compatibility_flags.includes("python_workers"),
    );
    assert.ok(config.env.staging.compatibility_flags.includes("nodejs_compat"));
  });
});

describe("Durable Object configuration", () => {
  it("adds the binding and a SQLite migration by default", () => {
    const config = build({ durableObject: true });
    assert.deepEqual(config.durable_objects.bindings, [
      { name: "STLITE_SERVER", class_name: "StliteServer" },
    ]);
    assert.deepEqual(config.migrations, [
      { tag: "stlite-v1", new_sqlite_classes: ["StliteServer"] },
    ]);
    assert.equal(config.exports, undefined);
  });

  it("accepts a compatible existing STLITE_SERVER declaration", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{
        "durable_objects": { "bindings": [
          { "name": "STLITE_SERVER", "class_name": "StliteServer" },
        ] },
        "migrations": [{ "tag": "v1", "new_sqlite_classes": ["StliteServer"] }],
      }`,
    });
    assert.equal(config.durable_objects.bindings.length, 1);
    assert.equal(config.migrations.length, 1);
  });

  it("preserves external bindings that use script_name", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "durable_objects": { "bindings": [
        { "name": "OTHER", "class_name": "Remote", "script_name": "other-worker" },
      ] } }`,
    });
    assert.equal(config.durable_objects.bindings.length, 2);
    assert.ok(
      config.durable_objects.bindings.some(
        (b: { script_name?: string }) => b.script_name === "other-worker",
      ),
    );
  });

  it("rejects local bindings to classes the entry module cannot export", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "durable_objects": { "bindings": [
            { "name": "MY_DO", "class_name": "MyThing" },
          ] } }`,
        }),
      /exports only StliteServer/,
    );
    // In plain-worker mode no Durable Object class is exported at all.
    assert.throws(
      () =>
        build({
          customJsonc: `{ "durable_objects": { "bindings": [
            { "name": "MY_DO", "class_name": "MyThing" },
          ] } }`,
        }),
      /exports no Durable Object classes/,
    );
  });

  it("rejects a conflicting STLITE_SERVER binding", () => {
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
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "durable_objects": { "bindings": [
            { "name": "STLITE_SERVER", "class_name": "StliteServer", "script_name": "other" },
          ] } }`,
        }),
      /not another Worker/,
    );
  });

  it("rejects duplicate migration tags", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
            { "tag": "v1", "new_sqlite_classes": [] },
          ] }`,
        }),
      /duplicate tag "v1"/,
    );
  });

  it("rejects StliteServer declared with key-value storage", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [{ "tag": "v1", "new_classes": ["StliteServer"] }] }`,
        }),
      /requires SQLite storage/,
    );
  });

  it("rejects deletion or rename of StliteServer", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
            { "tag": "v2", "deleted_classes": ["StliteServer"] },
          ] }`,
        }),
      /deletes class StliteServer/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
            { "tag": "v2", "renamed_classes": [{ "from": "StliteServer", "to": "Other" }] },
          ] }`,
        }),
      /renames class StliteServer/,
    );
  });

  it("generates a unique migration tag when stlite-v1 is taken", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "migrations": [{ "tag": "stlite-v1", "new_sqlite_classes": ["Ignored"] }] }`,
    });
    // "Ignored" is a declaration-only entry with no binding, so it does not
    // trip the local-class validation; the point is the fresh tag.
    assert.deepEqual(config.migrations[1], {
      tag: "stlite-v2",
      new_sqlite_classes: ["StliteServer"],
    });
  });

  it("extends an existing exports-style declaration instead of adding migrations", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": {
        "Remote": { "type": "durable-object", "storage": "sqlite" },
      } }`,
    });
    assert.deepEqual(config.exports.StliteServer, {
      type: "durable-object",
      storage: "sqlite",
    });
    assert.equal(config.migrations, undefined);
  });

  it("accepts a compatible exports-style StliteServer and rejects incompatible ones", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": {
        "StliteServer": { "type": "durable-object", "storage": "sqlite" },
      } }`,
    });
    assert.equal(config.exports.StliteServer.storage, "sqlite");

    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "StliteServer": { "type": "durable-object", "storage": "legacy-kv" },
          } }`,
        }),
      /must be "sqlite"/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "StliteServer": { "type": "durable-object", "state": "deleted" },
          } }`,
        }),
      /needs the class live/,
    );
  });

  it("rejects simultaneous exports and migrations declarations", () => {
    for (const durableObject of [true, false]) {
      assert.throws(
        () =>
          build({
            durableObject,
            customJsonc: `{
              "exports": { "X": { "type": "durable-object", "storage": "sqlite" } },
              "migrations": [{ "tag": "v1", "new_sqlite_classes": ["X"] }],
            }`,
          }),
        /mutually exclusive/,
      );
    }
  });
});
