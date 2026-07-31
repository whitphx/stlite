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
      /deletes or renames class StliteServer/,
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
      /deletes or renames class StliteServer/,
    );
  });

  it("generates a unique migration tag when stlite-v1 is taken", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "migrations": [
        { "tag": "stlite-v1", "new_sqlite_classes": ["Historical"] },
        { "tag": "cleanup", "deleted_classes": ["Historical"] },
      ] }`,
    });
    assert.deepEqual(config.migrations[2], {
      tag: "stlite-v2",
      new_sqlite_classes: ["StliteServer"],
    });
  });

  it("extends an existing exports-style declaration instead of adding migrations", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": {
        "Historical": { "type": "durable-object", "state": "deleted" },
      } }`,
    });
    assert.deepEqual(config.exports.StliteServer, {
      type: "durable-object",
      storage: "sqlite",
    });
    // Historical entries survive untouched.
    assert.equal(config.exports.Historical.state, "deleted");
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

describe("Durable Object effective live-class validation", () => {
  it("rejects an unsupported class left live in migrations", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Widget"] }] }`,
        }),
      /leaves local class Widget live/,
    );
  });

  it("accepts an unsupported class introduced and later deleted", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "migrations": [
        { "tag": "v1", "new_sqlite_classes": ["Widget"] },
        { "tag": "v2", "deleted_classes": ["Widget"] },
      ] }`,
    });
    // History preserved, StliteServer appended with a fresh tag.
    assert.equal(config.migrations.length, 3);
  });

  it("rejects renaming another class to StliteServer", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["Old"] },
            { "tag": "v2", "renamed_classes": [{ "from": "Old", "to": "StliteServer" }] },
          ] }`,
        }),
      /renames another class to StliteServer/,
    );
  });

  it("rejects recreation after deletion when it ends live", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_classes": ["Widget"] },
            { "tag": "v2", "deleted_classes": ["Widget"] },
            { "tag": "v3", "new_sqlite_classes": ["Widget"] },
          ] }`,
        }),
      /leaves local class Widget live/,
    );
  });

  it("rejects contradictory transitions", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["Widget"] },
            { "tag": "v2", "new_sqlite_classes": ["Widget"] },
          ] }`,
        }),
      /already live/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [{ "tag": "v1", "deleted_classes": ["Ghost"] }] }`,
        }),
      /not live at that point/,
    );
  });

  it("counts transferred-in classes as live", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "migrations": [
            { "tag": "v1", "transferred_classes": [
              { "from": "Old", "from_script": "other", "to": "Imported" },
            ] },
          ] }`,
        }),
      /leaves local class Imported live/,
    );
  });

  it("rejects plain-worker configs whose history leaves any class live", () => {
    assert.throws(
      () =>
        build({
          customJsonc: `{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["StliteServer"] }] }`,
        }),
      /leaves local class StliteServer live/,
    );
  });

  it("rejects a live unsupported exports entry and accepts historical ones", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Remote": { "type": "durable-object", "storage": "sqlite" },
          } }`,
        }),
      /exports\.Remote.*cannot export it/,
    );
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": {
        "Gone": { "type": "durable-object", "state": "transferred", "transferred_to": "other-worker" },
      } }`,
    });
    assert.equal(config.exports.Gone.state, "transferred");
    assert.equal(config.exports.StliteServer.storage, "sqlite");
  });

  it("rejects an exports rename that adopts the StliteServer name", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Old": { "type": "durable-object", "state": "renamed", "renamed_to": "StliteServer" },
          } }`,
        }),
      /renames another class to StliteServer/,
    );
  });

  it("rejects a live StliteServer exports entry in plain-worker mode", () => {
    assert.throws(
      () =>
        build({
          customJsonc: `{ "exports": {
            "StliteServer": { "type": "durable-object", "storage": "sqlite" },
          } }`,
        }),
      /plain-worker entry exports no Durable Object classes/,
    );
  });
});

describe("environment-level Durable Object declarations", () => {
  it("validates an environment exports override and completes it", () => {
    // A live unsupported class in the override is rejected... (top level in
    // exports style too, since cross-style overrides are invalid)
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {}, "env": { "staging": { "exports": {
            "OtherClass": { "type": "durable-object", "storage": "sqlite" },
          } } } }`,
        }),
      /env\.staging\.exports\.OtherClass.*cannot export it/,
    );
    // ...and a valid override gets its own StliteServer declaration, since
    // it replaces the top level wholesale.
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": {}, "env": { "staging": { "exports": {
        "Old": { "type": "durable-object", "state": "deleted" },
      } } } }`,
    });
    assert.deepEqual(config.env.staging.exports.StliteServer, {
      type: "durable-object",
      storage: "sqlite",
    });
  });

  it("rejects an environment declaration style that differs from the top level", () => {
    // The generated default declares top-level migrations, so an environment
    // exports override would combine with the inherited migrations — which
    // wrangler rejects as mutually exclusive.
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "env": { "staging": { "exports": {
            "Old": { "type": "durable-object", "state": "deleted" },
          } } } }`,
        }),
      /different style/,
    );
  });

  it("validates an environment migrations override", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "env": { "staging": { "migrations": [
            { "tag": "v1", "new_sqlite_classes": ["Widget"] },
          ] } } }`,
        }),
      /env\.staging\.migrations.*leaves local class Widget live/,
    );
    const config = build({
      durableObject: true,
      customJsonc: `{ "env": { "staging": { "migrations": [
        { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
      ] } } }`,
    });
    assert.equal(config.env.staging.migrations.length, 1);
  });

  it("rejects simultaneous environment exports and migrations", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "env": { "staging": {
            "exports": { "StliteServer": { "type": "durable-object", "storage": "sqlite" } },
            "migrations": [{ "tag": "v1", "new_sqlite_classes": ["StliteServer"] }],
          } } }`,
        }),
      /env\.staging\.exports.*mutually exclusive/,
    );
  });

  it("leaves environments without declaration overrides to inherit", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "env": { "staging": { "vars": { "STAGE": "1" } } } }`,
    });
    assert.equal(config.env.staging.exports, undefined);
    assert.equal(config.env.staging.migrations, undefined);
    assert.equal(config.migrations.length, 1);
  });
});

describe("expecting-transfer exports state", () => {
  it("treats expecting-transfer as a live class and rejects it for others", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Remote": { "type": "durable-object", "state": "expecting-transfer", "storage": "sqlite", "transfer_from": "another-worker" },
          } }`,
        }),
      /exports\.Remote.*live local Durable Object class \(state "expecting-transfer"\)/,
    );
  });

  it("rejects expecting-transfer for StliteServer itself", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "StliteServer": { "type": "durable-object", "state": "expecting-transfer", "storage": "sqlite", "transfer_from": "another-worker" },
          } }`,
        }),
      /cannot adopt a transferred namespace/,
    );
  });

  it("validates state-specific required properties", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Old": { "type": "durable-object", "state": "renamed" },
          } }`,
        }),
      /state "renamed" but no renamed_to/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Old": { "type": "durable-object", "state": "transferred" },
          } }`,
        }),
      /state "transferred" but no transferred_to/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": {
            "Old": { "type": "durable-object", "state": "vaporized" },
          } }`,
        }),
      /not a known Durable Object state/,
    );
  });
});

describe("non-Durable-Object exports and DO-to-plain conversion", () => {
  it("allows a Default worker export and rejects other named worker exports", () => {
    const config = build({
      durableObject: true,
      customJsonc: `{ "exports": { "Default": { "type": "worker" } } }`,
    });
    assert.deepEqual(config.exports.Default, { type: "worker" });

    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": { "Admin": { "type": "worker" } } }`,
        }),
      /exports\.Admin.*exports only Default/,
    );
  });

  it("rejects unknown export kinds and invalid entries", () => {
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": { "Thing": { "type": "queue-consumer" } } }`,
        }),
      /not a supported export kind/,
    );
    assert.throws(
      () =>
        build({
          durableObject: true,
          customJsonc: `{ "exports": { "Thing": "nope" } }`,
        }),
      /not a valid export declaration/,
    );
  });

  it("permits a DO-to-plain conversion via an exports tombstone", () => {
    const config = build({
      customJsonc: `{ "exports": {
        "StliteServer": { "type": "durable-object", "state": "deleted" },
      } }`,
    });
    assert.equal(config.exports.StliteServer.state, "deleted");

    const transferred = build({
      customJsonc: `{ "exports": {
        "StliteServer": { "type": "durable-object", "state": "transferred", "transferred_to": "other-worker" },
      } }`,
    });
    assert.equal(transferred.exports.StliteServer.state, "transferred");

    // Live states stay rejected in plain-worker mode.
    for (const live of [
      `{ "type": "durable-object", "storage": "sqlite" }`,
      `{ "type": "durable-object", "state": "expecting-transfer", "storage": "sqlite", "transfer_from": "x" }`,
    ]) {
      assert.throws(
        () =>
          build({
            customJsonc: `{ "exports": { "StliteServer": ${live} } }`,
          }),
        /plain-worker entry exports no Durable Object classes/,
      );
    }
  });

  it("permits a DO-to-plain conversion via legacy migrations", () => {
    const config = build({
      customJsonc: `{ "migrations": [
        { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
        { "tag": "v2", "deleted_classes": ["StliteServer"] },
      ] }`,
    });
    assert.equal(config.migrations.length, 2);
  });
});
