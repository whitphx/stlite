import type { CommandModule } from "yargs";

interface WebArgs {
  path: string;
}

export const webCommand: CommandModule<unknown, WebArgs> = {
  command: "web <path>",
  describe:
    "Convert a local Streamlit project into a multi-file Stlite web app directory",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "Path to the Streamlit project directory",
      demandOption: true,
    }),
  handler: (argv) => {
    console.log(`[web] TODO: package ${argv.path} as a Stlite web app`);
  },
};
