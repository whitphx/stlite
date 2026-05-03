import type { CommandModule } from "yargs";

interface HtmlArgs {
  path: string;
}

export const htmlCommand: CommandModule<unknown, HtmlArgs> = {
  command: "html <path>",
  describe:
    "Convert a local Streamlit project into a single self-contained HTML file",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "Path to the Streamlit project directory",
      demandOption: true,
    }),
  handler: (argv) => {
    console.log(`[html] TODO: emit single-file HTML for ${argv.path}`);
  },
};
