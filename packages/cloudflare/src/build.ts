import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseRequirementsTxt, validateRequirements } from "@stlite/common";
import { exists } from "./helpers/fsx.ts";
import { vendor } from "./vendor.ts";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Wrangler is the only tool the generated project needs at deploy time; pin the
// same range the package itself develops against.
const WRANGLER_VERSION = "^4.105.0";

export interface CloudflareBuildOptions {
  /** Path to the Streamlit project directory. */
  path: string;
  /** Output directory (default `./dist`). */
  out?: string;
  /** Entry script relative to `path` (default `streamlit_app.py`). */
  entrypoint?: string;
  /** Path to a requirements.txt file (defaults to `<path>/requirements.txt`). */
  requirements?: string;
  /** Worker name for a generated wrangler.jsonc. */
  name?: string;
}

/**
 * Package a Streamlit project into a deployable Cloudflare Python Workers
 * directory. Shared by the `stlite-cloudflare` bin and `@stlite/cli`'s
 * `stlite cloudflare` command, so both drive one implementation.
 */
export async function build({
  path: projectPath,
  out = "./dist",
  entrypoint = "streamlit_app.py",
  requirements,
  name,
}: CloudflareBuildOptions): Promise<{ outDir: string }> {
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
  // The output gets `rm -rf`'d on each run, and vendor() mirrors the whole
  // project dir into the bundle. Refuse paths that would delete the source or
  // get copied into itself: `-o .` (== srcDir), an ancestor of srcDir, or a
  // directory nested inside srcDir.
  if (
    outDir === srcDir ||
    srcDir.startsWith(outDir + path.sep) ||
    outDir.startsWith(srcDir + path.sep)
  ) {
    throw new Error(
      `Refusing to use ${outDir} as --out: it overlaps the project directory ${srcDir}. Pick a separate output directory outside it.`,
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

  await vendor({
    packageDir: packageRoot,
    projectDir: outDir,
    appDir: srcDir,
    cacheDir,
    entrypoint,
  });

  const outRel = path.relative(process.cwd(), outDir) || ".";
  console.log(`stlite-cloudflare: packaged → ${outDir}`);
  console.log(`Deploy with: cd ${outRel} && npx wrangler deploy`);

  return { outDir };
}

async function scaffoldOutput({
  srcDir,
  outDir,
  workerName,
  requirements,
}: {
  srcDir: string;
  outDir: string;
  workerName: string;
  requirements?: string;
}): Promise<void> {
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

async function readRequirements(
  srcDir: string,
  explicit?: string,
): Promise<string[]> {
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
  return validateRequirements(parseRequirementsTxt(text));
}

function defaultWranglerJsonc(workerName: string): string {
  return `${JSON.stringify(
    {
      $schema: "node_modules/wrangler/config-schema.json",
      name: workerName,
      main: "src/entry.py",
      compatibility_date: "2026-06-30",
      // no_handle_cross_request_promise_resolution: the resident Streamlit
      // runtime resolves promises across request contexts by design (the
      // single-flight init awaited by concurrent requests, the retained
      // lifespan task); workerd's default schedules those continuations onto
      // the creating request's context and drops them once it's gone, which
      // wedges later requests into hang-detection kills.
      compatibility_flags: [
        "python_workers",
        "no_handle_cross_request_promise_resolution",
      ],
      observability: { enabled: true },
      // Cold start (runtime extraction + Pyodide + Streamlit boot) needs far
      // more CPU than the default budget; this requires the Workers Paid plan
      // (the free plan's 10 ms CPU cap cannot boot Streamlit at all).
      limits: { cpu_ms: 300000 },
      // The frontend and the packed Python runtime are served from the assets
      // layer (assets don't count against the Worker script-size limit);
      // Streamlit page paths like /my_page serve the SPA index, while the
      // namespaces Streamlit's own server owns — plus /_stlite, so the packed
      // runtime (including the user's app source) is not directly
      // downloadable — are routed to the Worker before asset matching. The
      // ASSETS binding is how the Worker fetches the packed runtime at
      // startup.
      assets: {
        directory: "./assets",
        binding: "ASSETS",
        not_found_handling: "single-page-application",
        run_worker_first: [
          "/_stcore/*",
          "/media/*",
          "/component/*",
          "/app/static/*",
          "/_stlite/*",
        ],
      },
    },
    null,
    2,
  )}\n`;
}

function pyproject(workerName: string, dependencies: string[]): string {
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
# pywrangler (workers-py) drives every build of this project; pin a major
# range so an upstream breaking release can't take down user builds overnight
# (same reasoning as the wrangler pin in the generated package.json).
dev = ["workers-py>=1.15.0,<2"]

[tool.uv]
package = false
`;
}

function toWorkerName(name: string): string {
  // The name lands in wrangler.jsonc's "name", which Cloudflare restricts to
  // lowercase alphanumerics and dashes ("." and "_" are rejected at deploy).
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    // The line above already collapsed every run of non-alphanumerics to a
    // single dash, so at most one leading/trailing dash remains — trim it with
    // a single-character pattern (avoids the polynomial backtracking of `-+`).
    .replace(/^-|-$/g, "");
  return normalized || "stlite-cloudflare-app";
}
