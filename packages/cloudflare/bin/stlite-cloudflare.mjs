#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageJson = JSON.parse(
  await fs.readFile(path.join(packageRoot, "package.json"), "utf8"),
);

// Wrangler is the only tool the generated project needs at deploy time; pin the
// same range the package itself develops against.
const WRANGLER_VERSION = "^4.105.0";

const [command = "help", ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "build":
      await buildProject(args);
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

async function buildProject(args) {
  const opts = parseBuildArgs(args);

  const srcDir = path.resolve(process.cwd(), opts.path);
  const srcStat = await fs.stat(srcDir).catch(() => null);
  if (srcStat == null || !srcStat.isDirectory()) {
    throw new Error(`Not a directory: ${srcDir}`);
  }
  if (!(await exists(path.join(srcDir, opts.entrypoint)))) {
    throw new Error(
      `Entrypoint not found: ${opts.entrypoint} (looked in ${srcDir})`,
    );
  }

  const outDir = path.resolve(process.cwd(), opts.out);
  // The output gets `rm -rf`'d on each run. Refuse paths that would delete the
  // source — `-o .` (== srcDir) or any ancestor of it.
  if (outDir === srcDir || srcDir.startsWith(outDir + path.sep)) {
    throw new Error(
      `Refusing to use ${outDir} as --out: it is the project directory or an ancestor of it. Pick a separate output directory.`,
    );
  }

  const workerName = toWorkerName(opts.name ?? path.basename(srcDir));

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await scaffoldOutput({
    srcDir,
    outDir,
    workerName,
    requirements: opts.requirements,
  });

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
        STLITE_CLOUDFLARE_ENTRYPOINT: opts.entrypoint,
      },
    },
  );

  const outRel = path.relative(process.cwd(), outDir) || ".";
  console.log(`stlite-cloudflare: packaged → ${outDir}`);
  console.log(`Deploy with: cd ${outRel} && npx wrangler deploy`);
}

function parseBuildArgs(args) {
  const opts = {
    path: undefined,
    out: "./dist",
    entrypoint: "streamlit_app.py",
    requirements: undefined,
    name: undefined,
  };
  const positionals = [];
  const takesValue = {
    "-o": "out",
    "--out": "out",
    "--entrypoint": "entrypoint",
    "--requirements": "requirements",
    "--name": "name",
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg in takesValue) {
      const value = args[++i];
      if (value === undefined) {
        throw new Error(`Missing value for ${arg}`);
      }
      opts[takesValue[arg]] = value;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }
  if (positionals.length === 0) {
    throw new Error("Missing <path> to the Streamlit project directory");
  }
  if (positionals.length > 1) {
    throw new Error(
      `Unexpected extra arguments: ${positionals.slice(1).join(" ")}`,
    );
  }
  opts.path = positionals[0];
  return opts;
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

function printHelp() {
  console.log(`stlite-cloudflare ${packageJson.version}

Package a Streamlit project into a deployable Cloudflare Python Workers directory.

Usage:
  stlite-cloudflare build <path> [options]

Options:
  -o, --out <dir>            Output directory (default: ./dist)
  --entrypoint <name>        Entrypoint script, relative to <path> (default: streamlit_app.py)
  --requirements <file>      requirements.txt (default: <path>/requirements.txt if present)
  --name <name>              Worker name for a generated wrangler.jsonc (default: derived from <out>)

Deploy the output with Wrangler:
  cd <out> && npx wrangler deploy
`);
}
