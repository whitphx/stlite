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

describe("mirrorAppDir symlink policy", () => {
  let root: string;
  let outsideFile: string;
  let outsideDir: string;
  let symlinksAvailable = true;

  before(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "stlite-appfiles-sym-"));
    outsideFile = path.join(root, "outside.txt");
    await fs.writeFile(outsideFile, "outside");
    outsideDir = path.join(root, "outside-dir");
    await fs.mkdir(outsideDir);
    try {
      await fs.symlink(outsideFile, path.join(root, ".probe"));
    } catch {
      symlinksAvailable = false;
    }
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("dereferences relative and absolute in-project file symlinks", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app");
    await writeTree(appDir, { "streamlit_app.py": "real content" });
    await fs.symlink("streamlit_app.py", path.join(appDir, "relative.py"));
    await fs.symlink(
      path.join(appDir, "streamlit_app.py"),
      path.join(appDir, "absolute.py"),
    );

    const dest = path.join(root, "dest");
    await mirrorAppDir(appDir, dest);

    for (const name of ["relative.py", "absolute.py"]) {
      const stat = await fs.lstat(path.join(dest, name));
      assert.ok(stat.isFile() && !stat.isSymbolicLink());
      assert.equal(
        await fs.readFile(path.join(dest, name), "utf8"),
        "real content",
      );
    }
  });

  it("rejects a symlink resolving outside the project", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app2");
    await writeTree(appDir, { "streamlit_app.py": "" });
    await fs.symlink(outsideFile, path.join(appDir, "escape.txt"));

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest2")),
      /resolves outside the project/,
    );
  });

  it("rejects a broken symlink", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app3");
    await writeTree(appDir, { "streamlit_app.py": "" });
    await fs.symlink(
      path.join(appDir, "missing.txt"),
      path.join(appDir, "broken.txt"),
    );

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest3")),
      /Broken symlink/,
    );
  });

  it("rejects directory symlinks, including ones escaping the project", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app4");
    await writeTree(appDir, { "streamlit_app.py": "", "data/x.txt": "" });
    await fs.symlink(outsideDir, path.join(appDir, "escape-dir"));

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest4")),
      /Directory symlinks cannot be packaged|resolves outside the project/,
    );

    const appDir2 = path.join(root, "app5");
    await writeTree(appDir2, { "streamlit_app.py": "", "data/x.txt": "" });
    await fs.symlink(
      path.join(appDir2, "data"),
      path.join(appDir2, "data-link"),
    );

    await assert.rejects(
      mirrorAppDir(appDir2, path.join(root, "dest5")),
      /Directory symlinks cannot be packaged/,
    );
  });

  it("skips symlinks under excluded paths instead of failing", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app6");
    await writeTree(appDir, { "streamlit_app.py": "", ".git/HEAD": "" });
    await fs.symlink(outsideFile, path.join(appDir, ".git", "escape"));

    const dest = path.join(root, "dest6");
    await mirrorAppDir(appDir, dest);

    assert.deepEqual(await listFiles(dest), ["streamlit_app.py"]);
  });
});

describe("mirrorAppDir secrets and symlink-target exclusions", () => {
  let root: string;
  let symlinksAvailable = true;

  before(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "stlite-appfiles-sec-"));
    try {
      await fs.writeFile(path.join(root, ".t"), "");
      await fs.symlink(path.join(root, ".t"), path.join(root, ".probe"));
    } catch {
      symlinksAvailable = false;
    }
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("fails loudly when .streamlit/secrets.toml exists", async () => {
    const appDir = path.join(root, "app");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      ".streamlit/secrets.toml": 'password = "hunter2"',
      ".streamlit/config.toml": "[theme]",
    });

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest")),
      /secrets\.toml.*wrangler secret put.*st\.secrets/s,
    );
  });

  it("fails even when .stliteignore tries to re-include the secrets file", async () => {
    const appDir = path.join(root, "app2");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      ".streamlit/secrets.toml": 'password = "hunter2"',
      ".stliteignore": "!.streamlit/secrets.toml\n",
    });

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest2")),
      /must never be packaged/,
    );
  });

  it("fails loudly on Cloudflare .dev.vars files, including via symlink target", async (t) => {
    for (const name of [".dev.vars", ".dev.vars.staging"]) {
      const appDir = path.join(root, `app-${name.replace(/[^a-z]/g, "")}`);
      await writeTree(appDir, {
        "streamlit_app.py": "",
        [name]: "API_KEY=hunter2",
      });

      await assert.rejects(
        mirrorAppDir(
          appDir,
          path.join(root, `dest-${name.replace(/[^a-z]/g, "")}`),
        ),
        /must never be packaged/,
        `expected failure for ${name}`,
      );
    }

    if (!symlinksAvailable) return t.skip();
    // A symlink whose visible name is benign but whose target is an excluded
    // .dev.vars variant is rejected by the target check even when the direct
    // secret-file check is not what fires.
    const appDir = path.join(root, "app-devvarslink");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      "nested/.dev.vars.production": "API_KEY=hunter2",
    });
    await fs.symlink(
      path.join(appDir, "nested/.dev.vars.production"),
      path.join(appDir, "config.txt"),
    );

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest-devvarslink")),
      /config\.txt resolves to nested\/\.dev\.vars\.production.*excluded/,
    );
  });

  it("keeps non-secret .streamlit config packageable", async () => {
    const appDir = path.join(root, "app3");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      ".streamlit/config.toml": "[theme]",
    });

    const dest = path.join(root, "dest3");
    await mirrorAppDir(appDir, dest);

    assert.deepEqual(await listFiles(dest), [
      ".streamlit/config.toml",
      "streamlit_app.py",
    ]);
  });

  it("rejects symlinks whose resolved target is excluded", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const cases: [string, string][] = [
      ["settings.py", ".env"],
      ["git-config-copy", ".git/config"],
      ["dependency.py", "node_modules/private-package/config.py"],
    ];
    for (const [linkName, targetRel] of cases) {
      const appDir = path.join(root, `app-${linkName.replace(/[^a-z]/g, "")}`);
      await writeTree(appDir, {
        "streamlit_app.py": "",
        [targetRel]: "secret-content",
      });
      await fs.symlink(
        path.join(appDir, targetRel),
        path.join(appDir, linkName),
      );

      await assert.rejects(
        mirrorAppDir(
          appDir,
          path.join(root, `dest-${linkName.replace(/[^a-z]/g, "")}`),
        ),
        new RegExp(`${linkName}.*resolves to.*excluded`),
        `expected target-exclusion rejection for ${linkName} -> ${targetRel}`,
      );
    }
  });

  it("rejects a symlink to the secrets file via the secrets check", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app-secretlink");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      ".streamlit/secrets.toml": 'password = "hunter2"',
    });
    await fs.symlink(
      path.join(appDir, ".streamlit/secrets.toml"),
      path.join(appDir, "public_config.toml"),
    );

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest-secretlink")),
      /must never be packaged/,
    );
  });

  it("rejects a symlink to a file excluded by .stliteignore", async (t) => {
    if (!symlinksAvailable) return t.skip();
    const appDir = path.join(root, "app-userlink");
    await writeTree(appDir, {
      "streamlit_app.py": "",
      "draft.md": "internal notes",
      ".stliteignore": "*.md\n",
    });
    await fs.symlink(
      path.join(appDir, "draft.md"),
      path.join(appDir, "included.py"),
    );

    await assert.rejects(
      mirrorAppDir(appDir, path.join(root, "dest-userlink")),
      /included\.py resolves to draft\.md.*excluded/,
    );
  });
});
