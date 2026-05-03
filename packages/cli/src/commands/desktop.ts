import * as fs from "node:fs";
import * as path from "node:path";
import type { CommandModule } from "yargs";
import {
  packageApp,
  readRequirementsTxt,
  DEFAULT_PYODIDE_SOURCE,
  normalizePyodideSource,
} from "@stlite/app-packager";
import { validateRequirements } from "@stlite/common";
import { collectProjectFiles } from "../web-shell.js";

// Lazy-loaded inside the handler so `stlite --help` works even when
// @stlite/desktop hasn't been built yet (the manifest module is emitted
// alongside the desktop Electron build, not part of the cli's own bundle).
type DumpManifest = (options: {
  packageJsonStliteDesktopField: unknown;
  manifestFilePath: string;
  fallbacks?: Partial<{ entrypoint: string }>;
}) => Promise<void>;

interface DesktopArgs {
  path: string;
  out: string;
  entrypoint: string;
  requirements?: string;
  manifest?: string;
  pyodideSource: string;
}

export const desktopCommand: CommandModule<unknown, DesktopArgs> = {
  command: "desktop <path>",
  describe:
    "Convert a local Streamlit project into a Stlite Desktop project (multi-file dir + stlite-manifest.json)",
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
      .option("manifest", {
        type: "string",
        describe:
          "Path to a JSON file overriding the stlite-manifest.json contents (entrypoint, embed, nodeJsWorker, mountpoints, etc.)",
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

      // Copy @stlite/desktop's CRA SPA + wheels into destDir.
      const { desktopBuildDir, desktopWheelPaths } = resolveDesktopAssets();
      copyDesktopShell(desktopBuildDir, destDir);

      // Vendor prebuilt-package wheels + snapshot site-packages + copy app files.
      // Desktop's runtime loads streamlit/stlite_lib from the snapshot (it does
      // NOT install them via wheelUrls), so include them in the snapshot.
      await packageApp({
        destDir,
        sourceDir: projectDir,
        files: filesRel,
        entrypoint: argv.entrypoint,
        dependencies,
        localWheelPaths: desktopWheelPaths,
        pyodideSource: argv.pyodideSource,
      });

      // Desktop-specific manifest.
      const manifestOverrides = argv.manifest
        ? JSON.parse(fs.readFileSync(path.resolve(argv.manifest), "utf8"))
        : undefined;
      const dumpManifest = await loadDumpManifest();
      await dumpManifest({
        packageJsonStliteDesktopField: manifestOverrides,
        manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
        fallbacks: { entrypoint: argv.entrypoint },
      });

      console.log(`stlite desktop: packaged → ${destDir}`);
    } catch (err) {
      console.error(`stlite desktop: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};

interface DesktopAssets {
  desktopBuildDir: string;
  desktopWheelPaths: string[];
}

function resolveDesktopAssets(): DesktopAssets {
  const desktopPkgPath = require.resolve("@stlite/desktop/package.json");
  const desktopRoot = path.dirname(desktopPkgPath);
  const desktopBuildDir = path.join(desktopRoot, "build");
  const wheelsDir = path.join(desktopRoot, "wheels");
  const desktopWheelPaths = fs
    .readdirSync(wheelsDir)
    .filter((name) => name.endsWith(".whl"))
    .map((name) => path.join(wheelsDir, name));
  return { desktopBuildDir, desktopWheelPaths };
}

function copyDesktopShell(desktopBuildDir: string, destDir: string): void {
  for (const entry of fs.readdirSync(desktopBuildDir, {
    withFileTypes: true,
  })) {
    const src = path.join(desktopBuildDir, entry.name);
    const dst = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(src, dst, { recursive: true });
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

async function loadDumpManifest(): Promise<DumpManifest> {
  // manifest.js is emitted as ESM by desktop's build_electron.js so it
  // matches @stlite/desktop's `"type": "module"`. The other electron files
  // (main/preload/worker) are CJS but get loaded by Electron's own runtime,
  // which doesn't go through Node's resolver.
  const desktopPkgPath = require.resolve("@stlite/desktop/package.json");
  const manifestModulePath = path.join(
    path.dirname(desktopPkgPath),
    "build",
    "electron",
    "manifest.js",
  );
  const mod = (await import(manifestModulePath)) as {
    dumpManifest: DumpManifest;
  };
  return mod.dumpManifest;
}

function resolveRequirementsTxt(
  projectDir: string,
  explicit: string | undefined,
): string | null {
  if (explicit) return path.resolve(explicit);
  const defaultPath = path.join(projectDir, "requirements.txt");
  return fs.existsSync(defaultPath) ? defaultPath : null;
}
