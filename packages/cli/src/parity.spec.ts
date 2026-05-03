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
    const jsHtml = runJsCli(["html", FIXTURE]);
    const pyHtml = runPyCli(["html", FIXTURE]);
    expect(jsHtml).toEqual(golden);
    expect(pyHtml).toEqual(golden);
  });
});
