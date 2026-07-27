import type { CommandModule } from "yargs";

interface CloudflareArgs {
  path: string;
  out: string;
  entrypoint: string;
  // yargs camelizes the kebab-case flags at runtime; optional because the
  // builder's inferred type only carries the kebab-case keys.
  bundledRuntime?: boolean;
  durableObject?: boolean;
  mock: string[];
  slim: boolean;
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
      .option("bundled-runtime", {
        type: "boolean",
        default: false,
        describe:
          "Keep the Python runtime in the Worker script instead of loading it from static assets at cold start",
      })
      .option("durable-object", {
        type: "boolean",
        default: false,
        describe:
          "Route all traffic through a single Durable Object instance so every session shares one resident runtime",
      })
      .option("mock", {
        type: "string",
        array: true,
        default: [] as string[],
        describe:
          "Replace a package with an import stub and drop what it alone pulled into the runtime (repeatable)",
      })
      .option("slim", {
        type: "boolean",
        default: false,
        describe:
          "Alias for --mock pandas --mock numpy: the tested combination for apps without dataframes/charts",
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
        bundledRuntime: argv.bundledRuntime,
        durableObject: argv.durableObject,
        mock: argv.mock,
        slim: argv.slim,
        requirements: argv.requirements,
        name: argv.name,
      });
    } catch (err) {
      console.error(`stlite cloudflare: ${(err as Error).message}`);
      process.exit(1);
    }
  },
};
