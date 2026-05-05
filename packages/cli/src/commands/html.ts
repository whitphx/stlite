import * as fs from "node:fs";
import * as path from "node:path";
import type { CommandModule } from "yargs";
import { exportAsHtml } from "@stlite/sharing-common";
import { buildAppData } from "../app-data.js";

// `__STLITE_BROWSER_VERSION__` is replaced at bundle time by
// `scripts/build.js` with the version of `@stlite/browser` from the
// workspace at the moment the cli was built. Pinning to the bundled
// browser version keeps the default in lockstep with the cli release —
// no drift from a manually-bumped constant. Override per-invocation with
// `--runtime-version`.
declare const __STLITE_BROWSER_VERSION__: string;
const DEFAULT_RUNTIME_VERSION = __STLITE_BROWSER_VERSION__;

interface HtmlArgs {
  path: string;
  entrypoint: string;
  requirements?: string;
  out?: string;
  runtimeVersion: string;
}

export const htmlCommand: CommandModule<unknown, HtmlArgs> = {
  command: "html <path>",
  describe:
    "Convert a local Streamlit project into a single self-contained HTML file",
  builder: (yargs) =>
    yargs
      .positional("path", {
        type: "string",
        describe: "Path to the Streamlit project directory",
        demandOption: true,
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
      .option("out", {
        type: "string",
        alias: "o",
        describe: "Write output to a file instead of stdout",
      })
      .option("runtimeVersion", {
        type: "string",
        describe:
          "Version of @stlite/browser the exported page loads from JSDelivr",
        default: DEFAULT_RUNTIME_VERSION,
      }),
  handler: (argv) => {
    try {
      const projectDir = path.resolve(argv.path);
      const appData = buildAppData({
        projectDir,
        entrypoint: argv.entrypoint,
        requirementsPath: argv.requirements,
      });
      const html = exportAsHtml(appData, {
        runtimeVersion: argv.runtimeVersion,
      });
      if (argv.out) {
        fs.writeFileSync(path.resolve(argv.out), html, "utf8");
      } else {
        process.stdout.write(html);
      }
    } catch (err) {
      console.error(`stlite html: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};
