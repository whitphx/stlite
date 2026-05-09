import * as path from "node:path";
import type { CommandModule } from "yargs";
import { embedAppDataToUrl } from "@stlite/sharing-common";
import { buildAppData } from "../app-data.js";

const SHARING_APP_URL = "https://share.stlite.net/";
const EDITABLE_APP_URL = "https://edit.share.stlite.net/";

interface ShareArgs {
  path: string;
  entrypoint: string;
  requirements?: string;
  editable: boolean;
}

export const shareCommand: CommandModule<unknown, ShareArgs> = {
  command: "share <path>",
  describe: "Convert a local Streamlit project into a Stlite Sharing URL",
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
      .option("editable", {
        type: "boolean",
        describe:
          "Emit an editor URL (https://edit.share.stlite.net/) instead of the viewer URL",
        default: false,
      }),
  handler: (argv) => {
    try {
      const projectDir = path.resolve(argv.path);
      const appData = buildAppData({
        projectDir,
        entrypoint: argv.entrypoint,
        requirementsPath: argv.requirements,
      });
      const baseUrl = argv.editable ? EDITABLE_APP_URL : SHARING_APP_URL;
      console.log(embedAppDataToUrl(baseUrl, appData));
    } catch (err) {
      console.error(`stlite share: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};
