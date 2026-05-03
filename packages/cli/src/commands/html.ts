import * as fs from "node:fs";
import * as path from "node:path";
import type { CommandModule } from "yargs";
import { exportAsHtml } from "@stlite/sharing-common";
import { buildAppData } from "../app-data.js";

// Default version of @stlite/browser the exported page loads from JSDelivr.
// Bumped per release; override with --runtime-version when targeting a specific build.
const DEFAULT_RUNTIME_VERSION = "1.7.2";

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
