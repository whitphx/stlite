# @stlite/cloudflare

`@stlite/cloudflare` packages a local Streamlit project into a directory that
deploys to Cloudflare Python Workers, running the stlite-patched Streamlit
runtime. It vendors the Pyodide-compatible Python dependency tree, overlays the
stlite runtime and a Cloudflare-variant Streamlit frontend, and emits a
self-contained Worker directory. Deploying that directory is Wrangler's job.

## Usage

```bash
stlite-cloudflare build <path> -o <out>
cd <out>
npx wrangler deploy        # or: npx wrangler dev
```

`<path>` is a plain Streamlit project directory. The command produces a
deployable Worker directory at `<out>` (default `./dist`) containing
`wrangler.jsonc`, `src/entry.py`, and the vendored `python_modules/`.

### Options

- `-o, --out <dir>` — output directory (default `./dist`)
- `--entrypoint <name>` — entry script relative to `<path>` (default
  `streamlit_app.py`)
- `--requirements <file>` — a `requirements.txt` (default `<path>/requirements.txt`
  if present)
- `--name <name>` — Worker name for a generated `wrangler.jsonc` (default: derived
  from `<path>`)

If `<path>` already contains a `wrangler.jsonc`, it is passed through unchanged so
you keep control of routes, vars, and bindings; otherwise a minimal one is
generated. Either way you own `main` and `compatibility_flags`.

## Dependencies

Streamlit and its runtime dependency tree are vendored automatically by the
build, so they do not belong in your project. List only your app's own extra
dependencies in a `requirements.txt` next to your app (each must have a
Pyodide-compatible wheel), and rebuild.

## Limitations

HTTP responses are fully buffered in the Worker before being returned, so
streaming responses are not supported and large media payloads count against
the Worker isolate's memory limit.

## Release artifact TODO

The current source-tree build still compiles `stlite-lib`, the stlite-pinned
Streamlit wheel, and the Cloudflare-compatible frontend from the monorepo. A
publishable release should replace that with bundled or downloaded versioned
runtime artifacts so the build does not need the Stlite repository.
