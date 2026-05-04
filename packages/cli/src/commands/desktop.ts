import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import type { CommandModule } from "yargs";
import { packageApp } from "@stlite/app-packager";
import {
  collectWheelPaths,
  copyTreeFiltered,
  packageCommandBuilder,
  resolvePackageBuildDir,
  runPackageCommand,
  type PackageCommandArgs,
} from "../package-command.js";

const require = createRequire(import.meta.url);

// Lazy-loaded inside the handler so `stlite --help` works even when
// @stlite/desktop hasn't been built yet (the manifest module is emitted
// alongside the desktop Electron build, not part of the cli's own bundle).
type DumpManifest = (options: {
  packageJsonStliteDesktopField: unknown;
  manifestFilePath: string;
  fallbacks?: Partial<{ entrypoint: string }>;
}) => Promise<void>;

interface DesktopArgs extends PackageCommandArgs {
  manifest?: string;
}

export const desktopCommand: CommandModule<unknown, DesktopArgs> = {
  command: "desktop <path>",
  describe:
    "Convert a local Streamlit project into a Stlite Desktop project (multi-file dir + stlite-manifest.json)",
  builder: (yargs) =>
    packageCommandBuilder(yargs).option("manifest", {
      type: "string",
      describe:
        "Path to a JSON file overriding the stlite-manifest.json contents (entrypoint, embed, nodeJsWorker, mountpoints, etc.)",
    }),
  handler: (argv) =>
    runPackageCommand(argv, "desktop", async (ctx) => {
      const desktopBuildDir = resolvePackageBuildDir(
        "@stlite/desktop",
        "desktop",
      );
      copyTreeFiltered(desktopBuildDir, ctx.destDir);

      const desktopWheelPaths = collectWheelPaths(
        path.join(
          path.dirname(require.resolve("@stlite/desktop/package.json")),
          "wheels",
        ),
      );

      // Desktop's runtime loads streamlit/stlite_lib from the snapshot (it does
      // NOT install them via wheelUrls), so include them in the snapshot.
      await packageApp({
        destDir: ctx.destDir,
        sourceDir: ctx.projectDir,
        files: ctx.filesRel,
        entrypoint: ctx.entrypoint,
        dependencies: ctx.dependencies,
        localWheelPaths: desktopWheelPaths,
        pyodideSource: ctx.pyodideSource,
      });

      const manifestOverrides = argv.manifest
        ? JSON.parse(fs.readFileSync(path.resolve(argv.manifest), "utf8"))
        : undefined;
      const dumpManifest = await loadDumpManifest();
      await dumpManifest({
        packageJsonStliteDesktopField: manifestOverrides,
        manifestFilePath: path.resolve(ctx.destDir, "./stlite-manifest.json"),
        fallbacks: { entrypoint: ctx.entrypoint },
      });
    }),
};

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
  // Node's ESM dynamic import requires a `file://` URL, not a bare path —
  // bare paths break on Windows where `C:\...\manifest.js` isn't a valid
  // module specifier.
  const mod = (await import(pathToFileURL(manifestModulePath).href)) as {
    dumpManifest: DumpManifest;
  };
  return mod.dumpManifest;
}
