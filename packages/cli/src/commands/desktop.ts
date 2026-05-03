import type { CommandModule } from "yargs";

interface DesktopArgs {
  path: string;
}

export const desktopCommand: CommandModule<unknown, DesktopArgs> = {
  command: "desktop <path>",
  describe: "Convert a local Streamlit project into a Stlite Desktop project",
  builder: (yargs) =>
    yargs.positional("path", {
      type: "string",
      describe: "Path to the Streamlit project directory",
      demandOption: true,
    }),
  handler: (argv) => {
    console.log(
      `[desktop] TODO: package ${argv.path} as a Stlite Desktop project`,
    );
  },
};
