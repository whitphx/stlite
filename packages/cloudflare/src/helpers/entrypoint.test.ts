import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { resolveEntrypoint } from "./entrypoint.ts";

describe("resolveEntrypoint", () => {
  let root: string;
  let srcDir: string;
  let outsideFile: string;

  before(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "stlite-entrypoint-"));
    srcDir = path.join(root, "project");
    await fs.mkdir(path.join(srcDir, "pages"), { recursive: true });
    await fs.writeFile(path.join(srcDir, "streamlit_app.py"), "");
    await fs.writeFile(path.join(srcDir, "pages", "nested.py"), "");
    outsideFile = path.join(root, "outside.py");
    await fs.writeFile(outsideFile, "");
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("accepts the default entrypoint", async () => {
    assert.equal(
      await resolveEntrypoint(srcDir, "streamlit_app.py"),
      "streamlit_app.py",
    );
  });

  it("accepts a nested entrypoint and normalizes to POSIX separators", async () => {
    assert.equal(
      await resolveEntrypoint(srcDir, path.join("pages", "nested.py")),
      "pages/nested.py",
    );
  });

  it("rejects a missing entrypoint", async () => {
    await assert.rejects(
      resolveEntrypoint(srcDir, "missing.py"),
      /Entrypoint not found/,
    );
  });

  it("rejects a directory", async () => {
    await assert.rejects(
      resolveEntrypoint(srcDir, "pages"),
      /not a regular file/,
    );
  });

  it("rejects an absolute path", async () => {
    await assert.rejects(
      resolveEntrypoint(srcDir, path.join(srcDir, "streamlit_app.py")),
      /absolute path/,
    );
  });

  it("rejects .. traversal", async () => {
    await assert.rejects(
      resolveEntrypoint(srcDir, path.join("..", "outside.py")),
      /must stay inside the project/,
    );
  });

  it("accepts a symlink that resolves inside the project", async (t) => {
    const link = path.join(srcDir, "linked.py");
    try {
      await fs.symlink(path.join(srcDir, "streamlit_app.py"), link);
    } catch {
      t.skip("symlinks unavailable on this platform");
      return;
    }
    assert.equal(await resolveEntrypoint(srcDir, "linked.py"), "linked.py");
  });

  it("rejects a symlink that resolves outside the project", async (t) => {
    const link = path.join(srcDir, "escape.py");
    try {
      await fs.symlink(outsideFile, link);
    } catch {
      t.skip("symlinks unavailable on this platform");
      return;
    }
    await assert.rejects(
      resolveEntrypoint(srcDir, "escape.py"),
      /resolves outside the project/,
    );
  });
});
