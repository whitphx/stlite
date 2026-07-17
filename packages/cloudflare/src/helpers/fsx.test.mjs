import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { mirrorDir, removeMatching } from "./fsx.mjs";

let tmp;
before(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "fsx-test-"));
});
after(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

test("mirrorDir makes dest an exact copy, dropping stale files and excludes", async () => {
  const src = path.join(tmp, "src");
  await fs.mkdir(path.join(src, "sub"), { recursive: true });
  await fs.writeFile(path.join(src, "keep.txt"), "k");
  await fs.writeFile(path.join(src, ".build-stamp"), "s");
  await fs.writeFile(path.join(src, "sub", "nested.txt"), "n");

  const dest = path.join(tmp, "dest");
  await fs.mkdir(dest, { recursive: true });
  await fs.writeFile(path.join(dest, "stale.txt"), "old");

  await mirrorDir(src, dest, { exclude: [".build-stamp"] });

  assert.deepEqual((await fs.readdir(dest)).sort(), ["keep.txt", "sub"]);
  assert.equal(
    await fs.readFile(path.join(dest, "sub", "nested.txt"), "utf8"),
    "n",
  );
});

test("removeMatching deletes only entries the predicate accepts", async () => {
  const dir = path.join(tmp, "rm");
  for (const name of [
    "pyarrow",
    "pyarrow.libs",
    "pyarrow-17.0.0.dist-info",
    "pyarrow_hotfix",
    "pandas",
  ]) {
    await fs.mkdir(path.join(dir, name), { recursive: true });
  }

  await removeMatching(
    dir,
    (name) =>
      name === "pyarrow" ||
      name === "pyarrow.libs" ||
      /^pyarrow-.*\.dist-info$/.test(name),
  );

  assert.deepEqual((await fs.readdir(dir)).sort(), [
    "pandas",
    "pyarrow_hotfix",
  ]);
});
