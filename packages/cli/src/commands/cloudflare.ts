import type { CommandModule } from "yargs";

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
  // build() lives in @stlite/cloudflare — an optional dependency, since it ships
  // heavy Worker runtime artifacts most `stlite` users don't need. Import it
  // lazily so the CLI works without it, and point the user at the install when
  // it's missing. build() owns the input validation; this handler just maps the
  // CLI args onto it and applies the `stlite cloudflare:` error prefix.
  handler: async (argv) => {
    let cloudflare: typeof import("@stlite/cloudflare");
    try {
      cloudflare = await import("@stlite/cloudflare");
    } catch {
      console.error(
        "stlite cloudflare: the Cloudflare target requires @stlite/cloudflare. Install it with `npm install @stlite/cloudflare`.",
      );
      process.exit(1);
    }

    try {
      await cloudflare.build({
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
