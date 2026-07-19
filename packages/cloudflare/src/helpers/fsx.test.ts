import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { mirrorDir, singleWheel } from "./fsx.ts";

let tmp: string;
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

test("singleWheel resolves exactly one match and rejects zero or many", async () => {
  const dir = path.join(tmp, "wheels");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "streamlit-1.0-py3-none-any.whl"), "");
  await fs.writeFile(path.join(dir, "stlite_lib-1.0-py3-none-any.whl"), "");

  assert.equal(
    await singleWheel(dir, /^streamlit-.*\.whl$/),
    path.join(dir, "streamlit-1.0-py3-none-any.whl"),
  );
  await assert.rejects(() => singleWheel(dir, /^numpy-/), /No wheel matching/);
  await assert.rejects(() => singleWheel(dir, /whl$/), /Multiple wheels match/);
});
