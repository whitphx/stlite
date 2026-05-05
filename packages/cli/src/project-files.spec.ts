import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { collectProjectFiles } from "./project-files.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stlite-cli-walk-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("collectProjectFiles", () => {
  it("collects files in posix-style relative paths", () => {
    fs.writeFileSync(path.join(tmpDir, "app.py"), "");
    fs.mkdirSync(path.join(tmpDir, "data"));
    fs.writeFileSync(path.join(tmpDir, "data", "blob.bin"), "");

    expect(collectProjectFiles(tmpDir).sort()).toEqual([
      "app.py",
      "data/blob.bin",
    ]);
  });

  it("skips IGNORED_DIRS and .pyc files", () => {
    fs.writeFileSync(path.join(tmpDir, "app.py"), "");
    for (const ignored of [".git", "__pycache__", ".venv", "node_modules"]) {
      fs.mkdirSync(path.join(tmpDir, ignored));
      fs.writeFileSync(path.join(tmpDir, ignored, "junk"), "");
    }
    fs.writeFileSync(path.join(tmpDir, "real.pyc"), "");

    expect(collectProjectFiles(tmpDir)).toEqual(["app.py"]);
  });

  // Without the realpath-based guard the walk descends into `loop/`, then
  // `loop/loop/`, ad infinitum — Node eventually throws ENAMETOOLONG or
  // RangeError, but the test would still go red noisily. The exact-array
  // assertion catches a subtler regression too: a guard that lets the loop
  // be traversed *once* (so files appear under `loop/...` but not deeper)
  // would still fail this assertion.
  it("does not infinite-recurse on a self-referential symlink", () => {
    fs.writeFileSync(path.join(tmpDir, "app.py"), "");
    fs.symlinkSync(tmpDir, path.join(tmpDir, "loop"), "dir");

    expect(collectProjectFiles(tmpDir)).toEqual(["app.py"]);
  });
});
