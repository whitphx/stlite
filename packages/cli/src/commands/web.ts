import * as path from "node:path";
import type { CommandModule } from "yargs";
import { packageApp, copyPyodideRuntime } from "@stlite/app-packager";
import {
  collectWheelPaths,
  copyTreeFiltered,
  packageCommandBuilder,
  resolvePackageBuildDir,
  runPackageCommand,
  type PackageCommandArgs,
} from "../package-command.js";
import { writeWebIndexHtml } from "../web-shell.js";

// Files in @stlite/browser's build/ that aren't part of the runtime artifact
// — leftover demos and dev assets. Skipped when copying into destDir to keep
// the packaged output lean.
const BROWSER_BUILD_SKIP = new Set(["demos", "dev-files"]);

export const webCommand: CommandModule<unknown, PackageCommandArgs> = {
  command: "web <path>",
  describe:
    "Convert a local Streamlit project into a multi-file Stlite web app directory",
  builder: (yargs) => packageCommandBuilder(yargs),
  handler: (argv) =>
    runPackageCommand(argv, "web", async (ctx) => {
      // Copy @stlite/browser's SPA bundle (stlite.js + stlite.css + .map files,
      // plus its bundled wheels under wheels/ that the runtime self-installs).
      const browserBuildDir = resolvePackageBuildDir(
        "@stlite/browser",
        "browser",
      );
      copyTreeFiltered(browserBuildDir, ctx.destDir, BROWSER_BUILD_SKIP);

      // Pass the same wheels @stlite/browser self-installs at runtime so the
      // snapshot resolves their transitive prebuilt deps (e.g. streamlit pulls
      // in protobuf), which are then vendored under pyodide/ and listed in
      // prebuilt-packages.txt.
      const localWheelPaths = collectWheelPaths(
        path.join(browserBuildDir, "wheels"),
      );

      await packageApp({
        destDir: ctx.destDir,
        sourceDir: ctx.projectDir,
        files: ctx.filesRel,
        entrypoint: ctx.entrypoint,
        dependencies: ctx.dependencies,
        localWheelPaths,
        // The runtime installs stlite_lib + streamlit itself via @stlite/browser's
        // default wheelUrls; we just need the snapshot to include their prebuilt
        // deps (e.g. protobuf), not the wheels' own files.
        excludeLocalWheelsFromSnapshot: true,
        pyodideSource: ctx.pyodideSource,
      });

      // Copy Pyodide runtime files (pyodide.mjs, asm, wasm, lock) so the
      // packaged app boots offline without hitting a CDN.
      await copyPyodideRuntime(path.join(ctx.destDir, "pyodide"));

      writeWebIndexHtml({
        destDir: ctx.destDir,
        entrypoint: ctx.entrypoint,
        files: ctx.filesRel,
      });
    }),
};
