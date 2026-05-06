import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { CommandModule } from "yargs";
import {
  packageApp,
  readRequirementsTxt,
  DEFAULT_PYODIDE_SOURCE,
  normalizePyodideSource,
} from "@stlite/app-packager";
import { validateRequirements } from "@stlite/common";
import {
  collectWheelPaths,
  copyTreeFiltered,
  resolvePackageBuildDir,
} from "../package-command.js";

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
  pyodideSource: string;
}

interface StliteDesktopConfig {
  files: string[];
  entrypoint: string;
  dependencies?: string[];
  requirementsTxtFiles?: string[];
}

export const desktopCommand: CommandModule<unknown, DesktopArgs> = {
  command: "desktop <path>",
  describe:
    "Convert a local Streamlit project into a Stlite Desktop project (multi-file dir + stlite-manifest.json)",
  builder: (yargs) =>
    yargs
      .positional("path", {
        type: "string",
        describe:
          "Path to the project directory containing package.json with a `stlite.desktop` field",
        demandOption: true,
      })
      .option("out", {
        type: "string",
        alias: "o",
        describe: "Output directory",
        default: "./build",
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
      let projectStat;
      try {
        projectStat = fs.statSync(projectDir);
      } catch {
        throw new Error(`Not a directory: ${projectDir}`);
      }
      if (!projectStat.isDirectory()) {
        throw new Error(`Not a directory: ${projectDir}`);
      }

      // Read package.json#stlite.desktop. Match the legacy
      // `dump-stlite-desktop-artifacts` bin's behavior — entrypoint, files,
      // dependencies, requirementsTxtFiles, and the manifest fields
      // (embed/nodeJsWorker/idbfsMountpoints/nodefsMountpoints/appMenu) all
      // come from this field. The deprecated `appHomeDirSource`/`packages`
      // legacy fallbacks aren't carried over.
      const stliteDesktop = readStliteDesktopConfig(projectDir);

      const dependenciesFromRequirementsTxt = await collectRequirementsTxtDeps(
        projectDir,
        stliteDesktop.requirementsTxtFiles ?? [],
      );
      const dependencies = validateRequirements([
        ...(stliteDesktop.dependencies ?? []),
        ...dependenciesFromRequirementsTxt,
      ]);

      const destDir = path.resolve(argv.out);
      if (destDir === projectDir || projectDir.startsWith(destDir + path.sep)) {
        throw new Error(
          `Refusing to use ${destDir} as --out: it is the project directory or an ancestor of it. Pick a separate output directory.`,
        );
      }

      fs.rmSync(destDir, { recursive: true, force: true });
      fs.mkdirSync(destDir, { recursive: true });

      const desktopBuildDir = resolvePackageBuildDir(
        "@stlite/desktop",
        "desktop",
      );
      copyTreeFiltered(desktopBuildDir, destDir);

      const desktopWheelPaths = collectWheelPaths(
        path.join(
          path.dirname(
            fileURLToPath(import.meta.resolve("@stlite/desktop/package.json")),
          ),
          "wheels",
        ),
      );

      // Desktop's runtime loads streamlit/stlite_lib from the snapshot (it
      // does NOT install them via wheelUrls), so include them in the
      // snapshot.
      await packageApp({
        destDir,
        sourceDir: projectDir,
        files: stliteDesktop.files,
        entrypoint: stliteDesktop.entrypoint,
        dependencies,
        localWheelPaths: desktopWheelPaths,
        pyodideSource: argv.pyodideSource,
      });

      const dumpManifest = await loadDumpManifest();
      await dumpManifest({
        packageJsonStliteDesktopField: stliteDesktop,
        manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
        fallbacks: { entrypoint: stliteDesktop.entrypoint },
      });

      console.log(`stlite desktop: packaged → ${destDir}`);
    } catch (err) {
      console.error(`stlite desktop: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};

function readStliteDesktopConfig(projectDir: string): StliteDesktopConfig {
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      `package.json not found at ${packageJsonPath}. The desktop command reads its config from \`stlite.desktop\` in package.json.`,
    );
  }

  let packageJson: unknown;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (err) {
    throw new Error(
      `Failed to parse ${packageJsonPath}: ${(err as Error).message}`,
    );
  }

  const stliteDesktop =
    (packageJson as { stlite?: { desktop?: unknown } }).stlite?.desktop ??
    undefined;
  if (stliteDesktop == null || typeof stliteDesktop !== "object") {
    throw new Error(
      `Missing \`stlite.desktop\` field in ${packageJsonPath}. The desktop command requires \`stlite.desktop.files\` and \`stlite.desktop.entrypoint\` to be defined.`,
    );
  }
  const sd = stliteDesktop as Record<string, unknown>;

  if (
    !Array.isArray(sd.files) ||
    !sd.files.every((f) => typeof f === "string")
  ) {
    throw new Error(
      `\`stlite.desktop.files\` in ${packageJsonPath} must be an array of strings.`,
    );
  }
  if (typeof sd.entrypoint !== "string") {
    throw new Error(
      `\`stlite.desktop.entrypoint\` in ${packageJsonPath} must be a string.`,
    );
  }
  if (
    sd.dependencies != null &&
    (!Array.isArray(sd.dependencies) ||
      !sd.dependencies.every((d) => typeof d === "string"))
  ) {
    throw new Error(
      `\`stlite.desktop.dependencies\` in ${packageJsonPath} must be an array of strings.`,
    );
  }
  if (
    sd.requirementsTxtFiles != null &&
    (!Array.isArray(sd.requirementsTxtFiles) ||
      !sd.requirementsTxtFiles.every((p) => typeof p === "string"))
  ) {
    throw new Error(
      `\`stlite.desktop.requirementsTxtFiles\` in ${packageJsonPath} must be an array of strings.`,
    );
  }

  return {
    files: sd.files as string[],
    entrypoint: sd.entrypoint,
    dependencies: sd.dependencies as string[] | undefined,
    requirementsTxtFiles: sd.requirementsTxtFiles as string[] | undefined,
  };
}

async function collectRequirementsTxtDeps(
  projectDir: string,
  requirementsTxtFiles: string[],
): Promise<string[]> {
  if (requirementsTxtFiles.length === 0) return [];
  const resolved = requirementsTxtFiles.map((p) => path.resolve(projectDir, p));
  const groups = await Promise.all(resolved.map(readRequirementsTxt));
  return groups.flat();
}

async function loadDumpManifest(): Promise<DumpManifest> {
  // manifest.js is emitted as ESM by desktop's build_electron.js so it
  // matches @stlite/desktop's `"type": "module"`. The other electron files
  // (main/preload/worker) are CJS but get loaded by Electron's own runtime,
  // which doesn't go through Node's resolver.
  const desktopPkgPath = fileURLToPath(
    import.meta.resolve("@stlite/desktop/package.json"),
  );
  const manifestModulePath = path.join(
    path.dirname(desktopPkgPath),
    "build",
    "electron",
    "manifest.js",
  );
  // Node's ESM dynamic import requires a `file://` URL, not a bare path —
  // bare paths break on Windows where `C:\...\manifest.js` isn't a valid
  // module specifier.
  const mod = (await import(pathToFileURL(manifestModulePath).href)) as {
    dumpManifest: DumpManifest;
  };
  return mod.dumpManifest;
}
