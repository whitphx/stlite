import type { CommandModule } from "yargs";

interface ShareArgs {
  path: string;
}

export const shareCommand: CommandModule<unknown, ShareArgs> = {
  command: "share <path>",
  describe: "Convert a local Streamlit project into a Stlite Sharing URL",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "Path to the Streamlit project directory",
      demandOption: true,
    }),
  handler: (argv) => {
    console.log(`[share] TODO: generate sharing URL from ${argv.path}`);
  },
};
