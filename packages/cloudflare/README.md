# @stlite/cloudflare

`@stlite/cloudflare` packages a local Streamlit project into a directory that
deploys to Cloudflare Python Workers, running the Stlite-patched Streamlit
runtime. It vendors the Pyodide-compatible Python dependency tree, overlays the
Stlite runtime and a Cloudflare-variant Streamlit frontend, and emits a
self-contained Worker directory. Deploying that directory is Wrangler's job.

## Usage

```bash
stlite-cloudflare build <path> -o <out>
cd <out>
npx wrangler deploy        # or: npx wrangler dev
```

`<path>` is a plain Streamlit project directory. The command produces a
deployable Worker directory at `<out>` (default `./dist`) containing
`wrangler.jsonc`, `src/entry.py`, a slim `python_modules/`, and `assets/`
(the frontend plus the packed Python runtime, installed at cold start).

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
generated. Either way you own `main` and `compatibility_flags`. A custom config
must keep the generated `assets` block (the frontend and the packed Python
runtime are served from `./assets`, with the `ASSETS` binding and
`run_worker_first` for Streamlit's server namespaces) — without it the Worker
has no frontend and cannot load its runtime packages at startup.

## Requirements

The build needs [`uv`](https://docs.astral.sh/uv/) on your `PATH` — it drives
`pywrangler` to resolve your app's dependencies for the Pyodide target — plus
Node.js. Everything else (archive extraction, file copying) runs in-process, so
no `bash`, `python`, `rsync`, or `tar` is required.

It runs on macOS and Linux. On Windows, `pywrangler sync` can't complete yet (an
upstream issue locating its Pyodide interpreter), so build under WSL for now.

## Dependencies

Streamlit and its runtime dependency tree are vendored automatically by the
build, so they do not belong in your project. List only your app's own extra
dependencies in a `requirements.txt` next to your app (each must have a
Pyodide-compatible wheel), and rebuild.

## Limitations

HTTP responses are fully buffered in the Worker before being returned, so
streaming responses are not supported and large media payloads count against
the Worker isolate's memory limit.
