import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { zipSync } from "fflate";
import * as tar from "tar";
import { extractTarGz, extractZip } from "./archive.mjs";

let tmp;
before(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "archive-test-"));
});
after(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

test("extractZip writes every file with its nested path and bytes", async () => {
  const enc = new TextEncoder();
  const zipped = zipSync({
    "pkg/__init__.py": enc.encode("x = 1\n"),
    "pkg/sub/mod.py": enc.encode("y = 2\n"),
    "pkg-1.0.dist-info/METADATA": enc.encode("Name: pkg\n"),
  });
  const zipPath = path.join(tmp, "w.zip");
  await fs.writeFile(zipPath, zipped);

  const dest = path.join(tmp, "unz");
  await extractZip(zipPath, dest);

  assert.equal(
    await fs.readFile(path.join(dest, "pkg", "__init__.py"), "utf8"),
    "x = 1\n",
  );
  assert.equal(
    await fs.readFile(path.join(dest, "pkg", "sub", "mod.py"), "utf8"),
    "y = 2\n",
  );
  assert.equal(
    await fs.readFile(path.join(dest, "pkg-1.0.dist-info", "METADATA"), "utf8"),
    "Name: pkg\n",
  );
});

test("extractZip refuses entries that escape destDir", async () => {
  const zipped = zipSync({ "../evil.txt": new TextEncoder().encode("nope") });
  const zipPath = path.join(tmp, "evil.zip");
  await fs.writeFile(zipPath, zipped);
  await assert.rejects(
    () => extractZip(zipPath, path.join(tmp, "safe")),
    /outside/,
  );
});

test("extractTarGz round-trips a directory", async () => {
  const src = path.join(tmp, "tsrc");
  await fs.mkdir(path.join(src, "d"), { recursive: true });
  await fs.writeFile(path.join(src, "a.txt"), "A");
  await fs.writeFile(path.join(src, "d", "b.txt"), "B");
  const tgz = path.join(tmp, "t.tar.gz");
  await tar.c({ file: tgz, cwd: src, gzip: true }, ["."]);

  const dest = path.join(tmp, "tout");
  await extractTarGz(tgz, dest);
  assert.equal(await fs.readFile(path.join(dest, "a.txt"), "utf8"), "A");
  assert.equal(await fs.readFile(path.join(dest, "d", "b.txt"), "utf8"), "B");
});
