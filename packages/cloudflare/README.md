# @stlite/cloudflare

`@stlite/cloudflare` packages a local Streamlit project into a directory that deploys to Cloudflare Python Workers, running the Stlite-patched Streamlit runtime. It vendors the Pyodide-compatible Python dependency tree, overlays the Stlite runtime and a Cloudflare-variant Streamlit frontend, and emits a self-contained Worker directory. Deploying that directory is Wrangler's job.

## Usage

```bash
stlite-cloudflare build <path> -o <out>
cd <out>
npx wrangler deploy        # or: npx wrangler dev
```

`<path>` is a plain Streamlit project directory. The command produces a deployable Worker directory at `<out>` (default `./dist`) containing `wrangler.jsonc`, `src/entry.py`, a slim `python_modules/`, and `assets/` (the frontend plus the packed Python runtime, installed at cold start).

### Options

- `-o, --out <dir>` — output directory (default `./dist`)
- `--entrypoint <name>` — entry script relative to `<path>` (default `streamlit_app.py`)
- `--requirements <file>` — a `requirements.txt` (default `<path>/requirements.txt` if present)
- `--name <name>` — Worker name for a generated `wrangler.jsonc` (default: derived from `<path>`)

By default the heavy Python runtime ships as static assets that the Worker loads at cold start, keeping the script under Cloudflare's current size limits. Once Cloudflare's planned 64 MB-uncompressed script limit ships ([cloudflare/workers-py#156](https://github.com/cloudflare/workers-py/issues/156)), `--bundled-runtime` keeps everything in the script instead — no asset fetch or extraction at cold start.

`--mock <package>` (repeatable) replaces a vendored package with an import-satisfying stub so Streamlit still boots without it, then garbage-collects whatever that package alone pulled into the runtime: dists whose dependency metadata requires a mocked package are removed as broken, and dists nothing can reach anymore are removed as orphans. App code touching a mocked package fails at that point with an error naming the flag, and the build refuses `--mock` for a package your own `requirements.txt` asks for. Hand-tuned stubs ship for pandas and numpy (whose import surface Streamlit exercises at boot); other packages get a generated raise-on-use stub, which works for anything Streamlit imports lazily.

`--slim` is an alias for `--mock pandas --mock numpy` — the tested combination for apps that never use dataframes, charts, or numeric data (text/widget/chat-style apps). Mocking pandas cascades to the parquet serialization stack and pandas' own dependencies, roughly halving the script size and cold-start time; it is what makes `--bundled-runtime` fit under Cloudflare's current 10 MiB gzip script limit today.

By default the Worker routes all Streamlit traffic through a single [Durable Object](https://developers.cloudflare.com/durable-objects/) instance. Streamlit sessions have server-side state, and several HTTP endpoints (`/media/*` fetches, `/_stcore/upload_file/*` uploads) only work when they reach the same runtime that holds the session's WebSocket; the single instance guarantees that: uploads land in the runtime that reads them, media is served by the runtime that generated it, sessions survive WebSocket reconnects, and one cold boot serves all visitors. Idle instances are still evicted (the first request after a quiet period pays the cold boot), and the shared instance means a shared memory budget: all pages' imports and all sessions' media share one 128 MB isolate, so memory-heavy apps can exceed the limit there (the instance resets and recovers, but the session that tripped it is lost).

`--plain-worker` opts out of the Durable Object and runs as a plain Worker, where Cloudflare fans requests across isolates that each boot their own copy of the runtime. This is a **limited mode**: only media is bridged between isolates (a colo-local Cache API mirror); `st.file_uploader` uploads can land on an isolate that isn't running the session and fail; and a WebSocket reconnect can land anywhere, starting a fresh session (widget state resets). In exchange, memory load spreads across isolates instead of concentrating in one 128 MB instance. Use it for read-only apps that don't take uploads — especially memory-heavy ones (the hello sample deploys this way for exactly that reason).

If `<path>` already contains a `wrangler.jsonc`, it is parsed (JSONC comments are fine, though not preserved in the output) and merged with the configuration the generated Worker requires. Your settings — routes, vars, extra bindings, `observability`, `limits`, `name` — are preserved; the settings the Worker cannot run (or cannot run safely) without are always enforced: `main`, the `python_workers` and `no_handle_cross_request_promise_resolution` compatibility flags, and the `assets` block (`./assets` directory, `ASSETS` binding, SPA `not_found_handling`, and `run_worker_first` covering Streamlit's server namespaces plus `/_stlite/*`, which keeps the packed runtime and your app source from being served as public static files). A custom value that conflicts with a required setting fails the build with an error explaining what to change. Specifics:

- `run_worker_first: true` is preserved (it is stronger than the required route list); `false` is rejected; in arrays, your patterns are kept and the required routes appended, but a `!` exception pattern that could match a protected namespace is rejected — Cloudflare applies exceptions over positive patterns regardless of order, so no positive entry could win it back.
- Named environments (`env.<name>`) get the same treatment: overrides of `main`, `compatibility_flags`, or `assets` are validated and merged like the top level, and — since bindings are not inherited — each environment receives its own `STLITE_SERVER` Durable Object binding in the default mode.
- Durable Object declarations follow whichever style your config already uses: wrangler's `exports` map or the legacy `migrations` array (never both — they are mutually exclusive). The declaration history is replayed to its effective final state: entries for classes you later deleted or transferred away are preserved as history, but the only local class that may end up **live** is what the generated `src/entry.py` actually exports — `StliteServer` in the default mode, none with `--plain-worker`. `StliteServer` itself requires SQLite storage, must not be deleted or renamed (in either direction — another class cannot be renamed onto its name), and generated migration tags are made unique against yours. A Durable Object deployment can convert to `--plain-worker` by marking `StliteServer` deleted or transferred (tombstones are honored in both declaration styles); live states are what plain mode rejects. WorkerEntrypoint exports other than the reserved `default` key — and unknown export kinds — are rejected, since the generated entry provides only the default entrypoint; each Durable Object lifecycle state is validated as a discriminated union (required and forbidden fields, nonempty and live rename targets). Bindings to another Worker's classes (`script_name`) are preserved; bindings to other local classes are rejected. Every supported shape is validated against `wrangler deploy --dry-run` in CI (`scripts/dryrun-config-matrix.mjs`), and CI exercises both deployment modes end-to-end: the default Durable Object build boots in local workerd through the `STLITE_SERVER` routing path, and the plain-Worker build runs the real-browser smoke.

## Known limitations

The runtime is single-threaded: a very long synchronous compute burst in your script can starve the event loop that concurrently serves rendered media to the browser, and starved requests get canceled by the platform. Frame-loop pages like the hello app's Animation demo work as-is; if yours drops frames, shrink the per-frame work or sleep longer between frames.

## Requirements

Serving traffic requires the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/): the free plan's 10 ms CPU budget cannot boot Streamlit (the generated config raises the CPU limit accordingly, which is a paid-plan setting).

The build needs [`uv`](https://docs.astral.sh/uv/) on your `PATH` — it drives `pywrangler` to resolve your app's dependencies for the Pyodide target — plus Node.js. Everything else (archive extraction, file copying) runs in-process, so no `bash`, `python`, `rsync`, or `tar` is required.

It runs on macOS and Linux. On Windows, `pywrangler sync` can't complete yet (an upstream issue locating its Pyodide interpreter), so build under WSL for now.

## What gets packaged

The whole project directory is mirrored into the deployed app package, except:

- always excluded (not configurable): `.git/`, `.env` / `.env.*` / `*.env`, `.netrc`, `.aws/`, `.venv/`, `venv/`, `.direnv/`, `node_modules/`, `__pycache__/`, `.pytest_cache/`, `.mypy_cache/`, `.ruff_cache/`, `.wrangler/`, `.venv-workers/`, `.DS_Store`, plus the build's own output and cache directories, and the two build inputs consumed by the scaffold (`wrangler.jsonc`, `.stliteignore`)
- `.streamlit/secrets.toml` goes further: its presence **fails the build** (loudly, so local credentials are never silently dropped or shipped) — a `.stliteignore` negation cannot re-include it. Supply production secrets through Cloudflare bindings instead: `vars` in `wrangler.jsonc`, or encrypted secrets via `wrangler secret put`, both readable from the Worker's `env`. Other `.streamlit/` config (e.g. `config.toml`) packages normally.
- anything matched by a `.stliteignore` file in the project root (gitignore syntax); `.gitignore` is deliberately not applied, since projects often gitignore data files their app needs at runtime

Symlinks never survive into the package: a file symlink whose target resolves inside the project is dereferenced into a regular file, while symlinks that resolve outside the project, broken symlinks, and directory symlinks fail the build (the Worker-side archive extraction rejects unsafe links, so they could never deploy anyway). Exclusions apply to the resolved target as well as the visible path, so a symlink cannot smuggle an excluded file's content into the package under another name.

The build prints a packaging summary, including any file of 5 MiB or more that made it into the package. Exclusions are name-based only — no content-type extension is excluded, so application data files always ship.

## Secrets and configuration

`.streamlit/secrets.toml` and Cloudflare's `.dev.vars*` files never deploy (their presence fails the build; see above), and a custom `secrets.files` option in `.streamlit/config.toml` is rejected too — the packager cannot recognize arbitrarily-named secret files, so the option would smuggle them into the archive as ordinary app data. Instead, configuration flows from the Worker environment:

- plain configuration: `vars` in your project's `wrangler.jsonc`
- sensitive values: encrypted secrets via `wrangler secret put`

Both kinds surface to your app in two ways, identical in the Durable Object and plain-Worker modes:

- **`st.secrets`** — every string-valued environment entry is merged into Streamlit's secrets store before the app starts, so existing `st.secrets["KEY"]` code works unchanged.
- **`stlite_cloudflare.get_env()`** — the Worker environment object itself, for non-string bindings (R2 buckets, KV namespaces, ...).

The minimal sample demonstrates the bridge: its `wrangler.jsonc` sets an `APP_MESSAGE` var that the app reads through `st.secrets`.

## Dependencies

Streamlit and its runtime dependency tree are vendored automatically by the build, so they do not belong in your project. List only your app's own extra dependencies in a `requirements.txt` next to your app (each must have a Pyodide-compatible wheel), and rebuild.
