import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { mirrorAppDir } from "./app-files.ts";

async function writeTree(root: string, files: Record<string, string>) {
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content);
  }
}

async function listFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  const walk = async (rel: string) => {
    for (const entry of await fs.readdir(path.join(root, rel), {
      withFileTypes: true,
    })) {
      const entryRel = rel === "" ? entry.name : `${rel}/${entry.name}`;
      if (entry.isDirectory()) await walk(entryRel);
      else out.push(entryRel);
    }
  };
  await walk("");
  return out.sort();
}

describe("mirrorAppDir", () => {
  let root: string;

  before(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "stlite-appfiles-"));
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("excludes development files and secrets, keeps app source and data", async () => {
    const appDir = path.join(root, "app");
    await writeTree(appDir, {
      "streamlit_app.py": "import streamlit as st",
      "pages/second.py": "",
      "data/table.csv": "a,b\n1,2",
      "assets/logo.env.png": "not-a-secret",
      ".env": "SECRET=1",
      ".env.local": "SECRET=2",
      "prod.env": "SECRET=3",
      ".git/config": "[core]",
      ".venv/lib/site.py": "",
      "venv/bin/activate": "",
      "node_modules/pkg/index.js": "",
      "__pycache__/app.cpython-313.pyc": "",
      ".pytest_cache/README.md": "",
      ".mypy_cache/x.json": "",
      ".ruff_cache/x": "",
      ".wrangler/state.json": "",
      ".DS_Store": "",
      "wrangler.jsonc": "{}",
    });

    const dest = path.join(root, "dest");
    const summary = await mirrorAppDir(appDir, dest);

    assert.deepEqual(await listFiles(dest), [
      "assets/logo.env.png",
      "data/table.csv",
      "pages/second.py",
      "streamlit_app.py",
    ]);
    assert.equal(summary.fileCount, 4);
    assert.ok(summary.excludedCount > 0);
  });

  it("applies .stliteignore patterns from the project", async () => {
    const appDir = path.join(root, "app2");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      "notes/draft.md": "",
      "keep.md": "",
      ".stliteignore": "notes/\n*.secret\n",
      "api.secret": "",
    });

    const dest = path.join(root, "dest2");
    await mirrorAppDir(appDir, dest);

    assert.deepEqual(await listFiles(dest), ["keep.md", "streamlit_app.py"]);
  });

  it("excludes the output and cache directories wherever they are", async () => {
    const appDir = path.join(root, "app3");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      "build-out/worker.js": "",
      "build-cache/wheel.whl": "",
    });

    const dest = path.join(root, "dest3");
    await mirrorAppDir(appDir, dest, [
      path.join(appDir, "build-out"),
      path.join(appDir, "build-cache"),
    ]);

    assert.deepEqual(await listFiles(dest), ["streamlit_app.py"]);
  });

  it("reports large included files in the summary", async () => {
    const appDir = path.join(root, "app4");
    await fs.mkdir(appDir, { recursive: true });
    await fs.writeFile(path.join(appDir, "streamlit_app.py"), "");
    await fs.writeFile(
      path.join(appDir, "big.bin"),
      Buffer.alloc(6 * 1024 * 1024),
    );

    const summary = await mirrorAppDir(appDir, path.join(root, "dest4"));

    assert.equal(summary.largeFiles.length, 1);
    assert.equal(summary.largeFiles[0].relPath, "big.bin");
  });
});

describe("mirrorAppDir mandatory-exclusion independence", () => {
  let root: string;

  before(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "stlite-appfiles-neg-"));
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("ignores .stliteignore negations targeting mandatory exclusions", async () => {
    const appDir = path.join(root, "app");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      ".env": "SECRET=1",
      ".env.local": "SECRET=2",
      ".git/config": "[core]",
      "node_modules/pkg/index.js": "",
      "wrangler.jsonc": "{}",
      ".stliteignore": [
        "!.env",
        "!.env.local",
        "!.git/",
        "!.git/config",
        "!node_modules/",
        "!wrangler.jsonc",
        "!.stliteignore",
        "",
      ].join("\n"),
    });

    await mirrorAppDir(appDir, path.join(root, "dest"));

    assert.deepEqual(await listFiles(path.join(root, "dest")), [
      "streamlit_app.py",
    ]);
  });

  it("keeps ordinary gitignore negation semantics for user patterns", async () => {
    const appDir = path.join(root, "app2");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      "draft.md": "",
      "keep.md": "",
      ".stliteignore": "*.md\n!keep.md\n",
    });

    await mirrorAppDir(appDir, path.join(root, "dest2"));

    assert.deepEqual(await listFiles(path.join(root, "dest2")), [
      "keep.md",
      "streamlit_app.py",
    ]);
  });
});
