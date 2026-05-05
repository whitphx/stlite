import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import type { Argv } from "yargs";
import {
  readRequirementsTxt,
  DEFAULT_PYODIDE_SOURCE,
  normalizePyodideSource,
} from "@stlite/app-packager";
import { validateRequirements } from "@stlite/common";
import { collectProjectFiles } from "./project-files.js";

const require = createRequire(import.meta.url);

/**
 * Args common to `stlite web` and `stlite desktop` — both walk a Streamlit
 * project, copy a host-specific shell into the destination, and call
 * `packageApp` to vendor Pyodide deps.
 */
export interface PackageCommandArgs {
  path: string;
  out: string;
  entrypoint: string;
  requirements?: string;
  pyodideSource: string;
}

/**
 * Adds the `PackageCommandArgs` options to a yargs builder. Commands that
 * need extra options (e.g. `desktop`'s `--manifest`) chain `.option(...)`
 * onto the returned builder.
 */
export function packageCommandBuilder<T>(
  yargs: Argv<T>,
): Argv<T & PackageCommandArgs> {
  return yargs
    .positional("path", {
      type: "string",
      describe: "Path to the Streamlit project directory",
      demandOption: true,
    })
    .option("out", {
      type: "string",
      alias: "o",
      describe: "Output directory",
      default: "./build",
    })
    .option("entrypoint", {
      type: "string",
      describe: "Entrypoint script path, relative to <path>",
      default: "app.py",
    })
    .option("requirements", {
      type: "string",
      describe:
        "Path to a requirements.txt file (defaults to <path>/requirements.txt if present)",
    })
    .option("pyodideSource", {
      type: "string",
      describe:
        "Base URL or path of the Pyodide files (pyodide-lock.json, prebuilt wheels)",
      default: DEFAULT_PYODIDE_SOURCE,
      coerce: normalizePyodideSource,
    }) as Argv<T & PackageCommandArgs>;
}

/** Context handed to the host-specific body of a package command. */
export interface PackageCommandContext {
  projectDir: string;
  destDir: string;
  entrypoint: string;
  filesRel: string[];
  dependencies: string[];
  pyodideSource: string;
}

/**
 * Runs the boilerplate of a package command: validates the input, walks the
 * project, parses requirements, clears destDir, then hands off to a host-
 * specific `body` (which copies an SPA shell, calls `packageApp`, writes any
 * post-package artifacts). Errors get a clean `stlite <name>: ...` prefix
 * and exit 1.
 */
export async function runPackageCommand(
  argv: PackageCommandArgs,
  commandName: string,
  body: (ctx: PackageCommandContext) => Promise<void>,
): Promise<void> {
  try {
    const projectDir = path.resolve(argv.path);
    let projectStat;
    try {
      projectStat = fs.statSync(projectDir);
    } catch {
      throw new Error(`Not a directory: ${projectDir}`);
    }
    if (!projectStat.isDirectory()) {
      throw new Error(`Not a directory: ${projectDir}`);
    }
    if (!fs.existsSync(path.join(projectDir, argv.entrypoint))) {
      throw new Error(
        `Entrypoint not found: ${argv.entrypoint} (looked in ${projectDir})`,
      );
    }

    const destDir = path.resolve(argv.out);
    // The output gets `rm -rf`'d on each run. Refuse paths that would
    // delete the source — `--out .` (== projectDir) or any ancestor of it
    // (e.g. `--out ..`).
    if (destDir === projectDir || projectDir.startsWith(destDir + path.sep)) {
      throw new Error(
        `Refusing to use ${destDir} as --out: it is the project directory or an ancestor of it. Pick a separate output directory.`,
      );
    }

    const filesRel = collectProjectFiles(projectDir);

    const requirementsTxtPath = resolveRequirementsTxt(
      projectDir,
      argv.requirements,
    );
    const dependencies = requirementsTxtPath
      ? validateRequirements(await readRequirementsTxt(requirementsTxtPath))
      : [];

    fs.rmSync(destDir, { recursive: true, force: true });
    fs.mkdirSync(destDir, { recursive: true });

    await body({
      projectDir,
      destDir,
      entrypoint: argv.entrypoint,
      filesRel,
      dependencies,
      pyodideSource: argv.pyodideSource,
    });

    console.log(`stlite ${commandName}: packaged → ${destDir}`);
  } catch (err) {
    console.error(`stlite ${commandName}: ${(err as Error).message}`);
    process.exit(1);
  }
}

function resolveRequirementsTxt(
  projectDir: string,
  explicit: string | undefined,
): string | null {
  if (explicit) return path.resolve(explicit);
  const defaultPath = path.join(projectDir, "requirements.txt");
  return fs.existsSync(defaultPath) ? defaultPath : null;
}

/**
 * Resolves an upstream package's installed location and returns its `build/`
 * directory, with a friendly error (pointing at the right `make` target) if
 * the build hasn't been produced yet.
 */
export function resolvePackageBuildDir(
  packageName: string,
  makeTarget: string,
): string {
  const pkgPath = require.resolve(`${packageName}/package.json`);
  const buildDir = path.join(path.dirname(pkgPath), "build");
  if (!fs.existsSync(buildDir)) {
    throw new Error(
      `${packageName}'s build directory not found at ${buildDir}. Run \`make ${makeTarget}\` (or otherwise build ${packageName}) before packaging.`,
    );
  }
  return buildDir;
}

/**
 * Copies every file/dir under `srcDir` into `destDir`, optionally skipping
 * named entries (e.g. demos/dev-files that aren't part of the runtime
 * artifact). Caller is responsible for creating destDir first.
 */
export function copyTreeFiltered(
  srcDir: string,
  destDir: string,
  skip: Set<string> = new Set(),
): void {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const src = path.join(srcDir, entry.name);
    const dst = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(src, dst, { recursive: true });
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

/** Lists `.whl` files under a directory; throws a friendly error if missing. */
export function collectWheelPaths(wheelsDir: string): string[] {
  if (!fs.existsSync(wheelsDir)) {
    throw new Error(
      `Wheels directory not found at ${wheelsDir}. The upstream package may not be built — try \`make desktop\` or \`make browser\`.`,
    );
  }
  return fs
    .readdirSync(wheelsDir)
    .filter((name) => name.endsWith(".whl"))
    .map((name) => path.join(wheelsDir, name));
}
