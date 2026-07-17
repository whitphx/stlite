import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Wrangler is the only tool the generated project needs at deploy time; pin the
// same range the package itself develops against.
const WRANGLER_VERSION = "^4.105.0";

/**
 * Package a Streamlit project into a deployable Cloudflare Python Workers
 * directory. Shared by the `stlite-cloudflare` bin and `@stlite/cli`'s
 * `stlite cloudflare` command, so both drive one implementation.
 *
 * @param {object} options
 * @param {string} options.path Path to the Streamlit project directory.
 * @param {string} [options.out] Output directory (default `./dist`).
 * @param {string} [options.entrypoint] Entry script relative to `path`.
 * @param {string} [options.requirements] Path to a requirements.txt file.
 * @param {string} [options.name] Worker name for a generated wrangler.jsonc.
 * @returns {Promise<{ outDir: string }>}
 */
export async function build({
  path: projectPath,
  out = "./dist",
  entrypoint = "streamlit_app.py",
  requirements,
  name,
} = {}) {
  if (projectPath == null) {
    throw new Error("Missing <path> to the Streamlit project directory");
  }

  const srcDir = path.resolve(process.cwd(), projectPath);
  const srcStat = await fs.stat(srcDir).catch(() => null);
  if (srcStat == null || !srcStat.isDirectory()) {
    throw new Error(`Not a directory: ${srcDir}`);
  }
  if (!(await exists(path.join(srcDir, entrypoint)))) {
    throw new Error(
      `Entrypoint not found: ${entrypoint} (looked in ${srcDir})`,
    );
  }

  const outDir = path.resolve(process.cwd(), out);
  // The output gets `rm -rf`'d on each run. Refuse paths that would delete the
  // source — `-o .` (== srcDir) or any ancestor of it.
  if (outDir === srcDir || srcDir.startsWith(outDir + path.sep)) {
    throw new Error(
      `Refusing to use ${outDir} as --out: it is the project directory or an ancestor of it. Pick a separate output directory.`,
    );
  }

  const workerName = toWorkerName(name ?? path.basename(srcDir));

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await scaffoldOutput({ srcDir, outDir, workerName, requirements });

  // Caches (the multi-minute frontend build, the vendored Pyodide wheels) must
  // outlive the wiped-every-run output dir, so they live in a sibling dir.
  const cacheDir = path.join(
    path.dirname(outDir),
    `.${path.basename(outDir)}.stlite-cloudflare-cache`,
  );

  await run(
    "bash",
    [path.join(packageRoot, "scripts", "sync-workers-vendor.sh")],
    {
      env: {
        ...process.env,
        STLITE_CLOUDFLARE_PROJECT_DIR: outDir,
        STLITE_CLOUDFLARE_PACKAGE_DIR: packageRoot,
        STLITE_CLOUDFLARE_APP_DIR: srcDir,
        STLITE_CLOUDFLARE_CACHE_DIR: cacheDir,
        STLITE_CLOUDFLARE_ENTRYPOINT: entrypoint,
      },
    },
  );

  const outRel = path.relative(process.cwd(), outDir) || ".";
  console.log(`stlite-cloudflare: packaged → ${outDir}`);
  console.log(`Deploy with: cd ${outRel} && npx wrangler deploy`);

  return { outDir };
}

async function scaffoldOutput({ srcDir, outDir, workerName, requirements }) {
  await fs.mkdir(path.join(outDir, "src"), { recursive: true });
  await fs.writeFile(
    path.join(outDir, "src", "entry.py"),
    'from stlite_cloudflare.entry import Default\n\n__all__ = ["Default"]\n',
  );

  // An existing wrangler.jsonc in the project is the user's own Worker config
  // (routes, vars, bindings); pass it through untouched. Otherwise generate a
  // minimal one. Either way the user owns `main`/`compatibility_flags`.
  const srcWrangler = path.join(srcDir, "wrangler.jsonc");
  const wrangler = (await exists(srcWrangler))
    ? await fs.readFile(srcWrangler, "utf8")
    : defaultWranglerJsonc(workerName);
  await fs.writeFile(path.join(outDir, "wrangler.jsonc"), wrangler);

  const dependencies = await readRequirements(srcDir, requirements);
  await fs.writeFile(
    path.join(outDir, "pyproject.toml"),
    pyproject(workerName, dependencies),
  );

  // Wrangler resolves the project root from the nearest package.json, so the
  // output needs its own for `wrangler deploy` to treat <out> as the project
  // (rather than walking up to a parent package.json and missing this config).
  await fs.writeFile(
    path.join(outDir, "package.json"),
    `${JSON.stringify(
      {
        name: workerName,
        version: "0.1.0",
        private: true,
        devDependencies: { wrangler: WRANGLER_VERSION },
      },
      null,
      2,
    )}\n`,
  );

  await fs.writeFile(
    path.join(outDir, ".gitignore"),
    [
      "/node_modules",
      "/python_modules",
      "/.venv-workers",
      "/pylock.toml",
      "",
    ].join("\n"),
  );
}

async function readRequirements(srcDir, explicit) {
  const requirementsPath = explicit
    ? path.resolve(process.cwd(), explicit)
    : path.join(srcDir, "requirements.txt");
  if (!(await exists(requirementsPath))) {
    if (explicit) {
      throw new Error(`Requirements file not found: ${requirementsPath}`);
    }
    return [];
  }
  const text = await fs.readFile(requirementsPath, "utf8");
  return text
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter((line) => line.length > 0);
}

function defaultWranglerJsonc(workerName) {
  return `${JSON.stringify(
    {
      $schema: "node_modules/wrangler/config-schema.json",
      name: workerName,
      main: "src/entry.py",
      compatibility_date: "2026-06-30",
      compatibility_flags: ["python_workers"],
      observability: { enabled: true },
    },
    null,
    2,
  )}\n`;
}

function pyproject(workerName, dependencies) {
  const deps =
    dependencies.length === 0
      ? "[]"
      : `[\n${dependencies.map((dep) => `  ${JSON.stringify(dep)},`).join("\n")}\n]`;
  return `[project]
name = ${JSON.stringify(workerName)}
version = "0.1.0"
requires-python = ">=3.13,<3.14"
# Streamlit and its runtime dependencies are vendored automatically by the
# build; only your app's own extra dependencies are resolved from here.
dependencies = ${deps}

[dependency-groups]
dev = ["workers-py"]

[tool.uv]
package = false
`;
}

function toWorkerName(name) {
  // The name lands in wrangler.jsonc's "name", which Cloudflare restricts to
  // lowercase alphanumerics and dashes ("." and "_" are rejected at deploy).
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "stlite-cloudflare-app";
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "inherit",
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}`,
          ),
        );
      }
    });
  });
}
