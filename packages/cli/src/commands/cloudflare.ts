import type { CommandModule } from "yargs";
import { build } from "@stlite/cloudflare";

interface CloudflareArgs {
  path: string;
  out: string;
  entrypoint: string;
  requirements?: string;
  name?: string;
}

export const cloudflareCommand: CommandModule<unknown, CloudflareArgs> = {
  command: "cloudflare <path>",
  describe:
    "Convert a local Streamlit project into a deployable Cloudflare Python Workers directory",
  builder: (yargs) =>
    yargs
      .positional("path", {
        type: "string",
        describe: "Path to the Streamlit project directory",
        demandOption: true,
      })
      .option("out", {
        type: "string",
        alias: "o",
        describe: "Output directory",
        default: "./dist",
      })
      .option("entrypoint", {
        type: "string",
        describe: "Entrypoint script path, relative to <path>",
        default: "streamlit_app.py",
      })
      .option("requirements", {
        type: "string",
        describe:
          "Path to a requirements.txt file (defaults to <path>/requirements.txt if present)",
      })
      .option("name", {
        type: "string",
        describe:
          "Worker name for a generated wrangler.jsonc (default: derived from <path>)",
      }),
  // build() lives in @stlite/cloudflare (it owns the Worker runtime artifacts and
  // the vendoring script) and does its own input validation; this handler just
  // maps the CLI args onto it and applies the `stlite cloudflare:` error prefix.
  handler: async (argv) => {
    try {
      await build({
        path: argv.path,
        out: argv.out,
        entrypoint: argv.entrypoint,
        requirements: argv.requirements,
        name: argv.name,
      });
    } catch (err) {
      console.error(`stlite cloudflare: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};
