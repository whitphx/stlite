// Validate every wrangler-config shape the merger supports against real
// wrangler (`deploy --dry-run`), using an already-built output directory for
// the assets/python_modules the config references.
//
// Usage: node dryrun-config-matrix.mjs <built-dist-dir>
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

// Resolve @stlite/cloudflare from the CURRENT WORKING DIRECTORY, not from
// this script's own location (plain ESM imports resolve from the latter,
// which in CI is the unbuilt monorepo checkout). In the monorepo run it
// from packages/cloudflare after `yarn build`; standalone, from the project
// that installed the tarball.
const requireFromCwd = createRequire(
  path.join(process.cwd(), "resolve-anchor.js"),
);
const { buildWranglerConfig } = await import(
  pathToFileURL(requireFromCwd.resolve("@stlite/cloudflare")).href
);

const distDir = process.argv[2];
if (!distDir) {
  console.error("usage: node dryrun-config-matrix.mjs <built-dist-dir>");
  process.exit(1);
}

const shapes = {
  "default-do": { durableObject: true },
  plain: { durableObject: false },
  "do-env": {
    durableObject: true,
    customJsonc: `{ "env": { "staging": { "vars": { "STAGE": "1" } } } }`,
    envs: ["staging"],
  },
  "plain-env": {
    durableObject: false,
    customJsonc: `{ "env": { "staging": { "vars": { "STAGE": "1" } } } }`,
    envs: ["staging"],
  },
  "do-legacy-migrations": {
    durableObject: true,
    customJsonc: `{ "migrations": [
      { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
    ] }`,
  },
  "do-exports": {
    durableObject: true,
    customJsonc: `{ "exports": { "StliteServer": { "type": "durable-object", "storage": "sqlite" } } }`,
  },
  "do-external-binding": {
    durableObject: true,
    customJsonc: `{ "durable_objects": { "bindings": [
      { "name": "OTHER", "class_name": "Remote", "script_name": "other-worker" },
    ] } }`,
  },
  "rwf-true": {
    durableObject: true,
    customJsonc: `{ "assets": { "run_worker_first": true } }`,
  },
  "do-env-exports": {
    durableObject: true,
    // Top level in exports style too: an environment cannot override with a
    // different declaration style than it inherits.
    customJsonc: `{ "exports": {}, "env": { "staging": { "exports": {
      "Old": { "type": "durable-object", "state": "deleted" },
    } } } }`,
    envs: ["staging"],
  },
  "do-env-migrations": {
    durableObject: true,
    customJsonc: `{ "env": { "staging": { "migrations": [
      { "tag": "v1", "new_sqlite_classes": ["StliteServer"] },
    ] } } }`,
    envs: ["staging"],
  },
  "do-exports-historical": {
    durableObject: true,
    customJsonc: `{ "exports": {
      "Gone": { "type": "durable-object", "state": "transferred", "transferred_to": "other-worker" },
    } }`,
  },
  "do-exports-default-worker": {
    durableObject: true,
    customJsonc: `{ "exports": { "Default": { "type": "worker" } } }`,
  },
  "plain-exports-tombstone": {
    durableObject: false,
    customJsonc: `{ "exports": {
      "StliteServer": { "type": "durable-object", "state": "deleted" },
    } }`,
  },
};

const original = await fs.readFile(
  path.join(distDir, "wrangler.jsonc"),
  "utf8",
);
let failed = false;
try {
  for (const [name, { durableObject, customJsonc, envs }] of Object.entries(
    shapes,
  )) {
    const config = buildWranglerConfig({
      workerName: "stlite-config-matrix",
      durableObject,
      customJsonc,
    });
    await fs.writeFile(path.join(distDir, "wrangler.jsonc"), config);
    for (const envName of [undefined, ...(envs ?? [])]) {
      const args = ["wrangler", "deploy", "--dry-run"];
      if (envName) args.push("--env", envName);
      const result = spawnSync("npx", args, { cwd: distDir, encoding: "utf8" });
      const label = envName ? `${name} --env ${envName}` : name;
      if (result.status === 0) {
        console.log(`${label}: OK`);
      } else {
        failed = true;
        console.error(`${label}: FAILED\n${result.stdout}\n${result.stderr}`);
      }
    }
  }
} finally {
  await fs.writeFile(path.join(distDir, "wrangler.jsonc"), original);
}
process.exit(failed ? 1 : 0);
