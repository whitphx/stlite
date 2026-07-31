// Validate every wrangler-config shape the merger supports against real
// wrangler (`deploy --dry-run`), using an already-built output directory for
// the assets/python_modules the config references.
//
// Usage: node dryrun-config-matrix.mjs <built-dist-dir>
// Resolves @stlite/cloudflare from the caller's node_modules (in the
// monorepo, run after `yarn build`; standalone, after installing the tarball).
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { buildWranglerConfig } from "@stlite/cloudflare";

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
