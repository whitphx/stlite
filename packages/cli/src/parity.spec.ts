import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const FIXTURE = path.join(REPO_ROOT, "test-fixtures/sample-project");
const JS_BIN = path.join(REPO_ROOT, "packages/cli/dist/cli.js");
const PY_PROJECT = path.join(REPO_ROOT, "packages/cli/py");

function runJsCli(args: string[]): string {
  return execFileSync("node", [JS_BIN, ...args], { encoding: "utf8" });
}

function runPyCli(args: string[]): string {
  return execFileSync(
    "uv",
    ["run", "--project", PY_PROJECT, "stlite", ...args],
    {
      encoding: "utf8",
    },
  );
}

/**
 * Cross-runtime parity tests. The whole point of `Option A` (separate
 * implementations rather than one runtime wrapping the other) is that both
 * runtimes produce byte-identical output for the share/html commands. This
 * spec proves it against the fixture.
 *
 * Prerequisites (CI must run these before `yarn test`):
 * - `yarn workspace @stlite/cli build` (so dist/cli.js exists)
 * - `make cli-py-proto` (so the Python betterproto stubs exist)
 * - `uv sync` (so the Python venv has stlite-cli installed)
 */
// Pin both runtimes to a fixed `--runtime-version` so the golden HTML
// stays stable when `@stlite/browser`'s workspace version bumps. The
// default version on each side is now derived at build-time from
// `packages/browser/package.json` (esbuild `define:` for JS, generated
// `_runtime_version.py` for Python), so a browser bump would otherwise
// silently invalidate this fixture.
const FIXTURE_RUNTIME_VERSION = "1.7.2";

describe("CLI cross-runtime parity", () => {
  beforeAll(() => {
    if (!fs.existsSync(JS_BIN)) {
      throw new Error(
        `Built JS bin not found at ${JS_BIN} — run \`yarn workspace @stlite/cli build\` first.`,
      );
    }
    const protoFile = path.join(PY_PROJECT, "stlite_cli/_proto/models.py");
    if (!fs.existsSync(protoFile)) {
      throw new Error(
        `Python proto stubs not found at ${protoFile} — run \`make cli-py-proto\` first.`,
      );
    }
    const runtimeVersionFile = path.join(
      PY_PROJECT,
      "stlite_cli/_runtime_version.py",
    );
    if (!fs.existsSync(runtimeVersionFile)) {
      throw new Error(
        `Python runtime-version module not found at ${runtimeVersionFile} — run \`make cli-py-runtime-version\` first.`,
      );
    }
  });

  it("share: JS == Python == golden URL", () => {
    const golden = fs
      .readFileSync(
        path.join(REPO_ROOT, "test-fixtures/sample-project.expected-url.txt"),
        "utf8",
      )
      .trim();
    const jsUrl = runJsCli(["share", FIXTURE]).trim();
    const pyUrl = runPyCli(["share", FIXTURE]).trim();
    expect(jsUrl).toEqual(golden);
    expect(pyUrl).toEqual(golden);
  });

  it("html: JS == Python == golden HTML", () => {
    const golden = fs.readFileSync(
      path.join(REPO_ROOT, "test-fixtures/sample-project.expected-html.html"),
      "utf8",
    );
    const args = [
      "html",
      FIXTURE,
      "--runtime-version",
      FIXTURE_RUNTIME_VERSION,
    ];
    const jsHtml = runJsCli(args);
    const pyHtml = runPyCli(args);
    expect(jsHtml).toEqual(golden);
    expect(pyHtml).toEqual(golden);
  });
});
