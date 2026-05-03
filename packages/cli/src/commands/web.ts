import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import type { CommandModule } from "yargs";
import {
  packageApp,
  readRequirementsTxt,
  copyPyodideRuntime,
  DEFAULT_PYODIDE_SOURCE,
  normalizePyodideSource,
} from "@stlite/app-packager";
import { validateRequirements } from "@stlite/common";
import { writeWebIndexHtml, collectProjectFiles } from "../web-shell.js";

interface WebArgs {
  path: string;
  out: string;
  entrypoint: string;
  requirements?: string;
  pyodideSource: string;
}

const require = createRequire(import.meta.url);

export const webCommand: CommandModule<unknown, WebArgs> = {
  command: "web <path>",
  describe:
    "Convert a local Streamlit project into a multi-file Stlite web app directory",
  builder: (yargs) =>
    yargs
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
      }),
  handler: async (argv) => {
    try {
      const projectDir = path.resolve(argv.path);
      if (!fs.statSync(projectDir).isDirectory()) {
        throw new Error(`Not a directory: ${projectDir}`);
      }
      if (!fs.existsSync(path.join(projectDir, argv.entrypoint))) {
        throw new Error(
          `Entrypoint not found: ${argv.entrypoint} (looked in ${projectDir})`,
        );
      }

      const destDir = path.resolve(argv.out);
      const filesRel = collectProjectFiles(projectDir);

      const requirementsTxtPath = resolveRequirementsTxt(
        projectDir,
        argv.requirements,
      );
      const dependencies = requirementsTxtPath
        ? validateRequirements(await readRequirementsTxt(requirementsTxtPath))
        : [];

      // Reset destDir so a re-run starts clean.
      fs.rmSync(destDir, { recursive: true, force: true });
      fs.mkdirSync(destDir, { recursive: true });

      // Copy @stlite/browser's SPA bundle (stlite.js + stlite.css + .map files,
      // plus its bundled wheels under wheels/ that the runtime self-installs).
      const browserBuildDir = resolveBrowserBuildDir();
      copyBrowserShell(browserBuildDir, destDir);

      // The same wheels @stlite/browser self-installs at runtime — passing them
      // to packageApp ensures the site-packages snapshot resolves their
      // transitive prebuilt deps (e.g. streamlit pulls in protobuf), which are
      // then vendored under pyodide/ and listed in prebuilt-packages.txt.
      const browserWheelsDir = path.join(browserBuildDir, "wheels");
      const localWheelPaths = fs
        .readdirSync(browserWheelsDir)
        .filter((name) => name.endsWith(".whl"))
        .map((name) => path.join(browserWheelsDir, name));

      // Vendor prebuilt-package wheels + snapshot site-packages + copy app files.
      await packageApp({
        destDir,
        sourceDir: projectDir,
        files: filesRel,
        entrypoint: argv.entrypoint,
        dependencies,
        localWheelPaths,
        // The runtime installs stlite_lib + streamlit itself via @stlite/browser's
        // default wheelUrls; we just need the snapshot to include their prebuilt
        // deps (e.g. protobuf), not the wheels' own files.
        excludeLocalWheelsFromSnapshot: true,
        pyodideSource: argv.pyodideSource,
      });

      // Copy Pyodide runtime files (pyodide.mjs, asm, wasm, lock) so the
      // packaged app boots offline without hitting a CDN.
      await copyPyodideRuntime(path.join(destDir, "pyodide"));

      // Write the minimal index.html that wires everything together.
      writeWebIndexHtml({
        destDir,
        entrypoint: argv.entrypoint,
        files: filesRel,
      });

      console.log(`stlite web: packaged → ${destDir}`);
    } catch (err) {
      console.error(`stlite web: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};

function resolveBrowserBuildDir(): string {
  const browserPkgPath = require.resolve("@stlite/browser/package.json");
  return path.join(path.dirname(browserPkgPath), "build");
}

function copyBrowserShell(browserBuildDir: string, destDir: string): void {
  // Copy the runtime artifacts (stlite.js, stlite.css, plus their source maps
  // and any sibling assets like wheels). Skip files that the packager will
  // overwrite with project-specific content (e.g. the demos in @stlite/browser
  // are not relevant to a packaged user app).
  for (const entry of fs.readdirSync(browserBuildDir, {
    withFileTypes: true,
  })) {
    const src = path.join(browserBuildDir, entry.name);
    const dst = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(src, dst, { recursive: true });
    } else {
      fs.copyFileSync(src, dst);
    }
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
