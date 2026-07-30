# Contributing to `@stlite/cloudflare`

## Building

`stlite-cloudflare build` vendors a project against the package's **prebuilt
runtime artifacts** (`runtime/`, `dist/`). This is the only vendoring path — it
is cross-platform (Windows/macOS/Linux) and needs only `uv` and Node.js. A
published package ships those artifacts.

In a fresh monorepo checkout they don't exist yet; run `make cloudflare` first to
produce them (it compiles `stlite-lib`, the stlite-pinned Streamlit wheel, and
the Cloudflare-variant Streamlit frontend, and bundles the build orchestration).
`make cloudflare` spawns `make`, `corepack yarn`, and `git`, so it needs `make`
and a POSIX shell — on Windows, build under WSL or use the published package.

## Release artifacts

`make cloudflare` assembles the `runtime/` artifacts (the built frontend and
the stlite-lib/Streamlit wheels) that the bundled mode ships; the Streamlit
dependency list is read from the shipped wheel's own METADATA at build time
rather than from a separate snapshot. The intent is that a
publishable release contains everything needed to build a Worker without the
Stlite repository or its `streamlit` submodule; `verify-cloudflare-standalone`
in CI proves that by building from the packed tarball alone (Linux only — the
full build can't run on Windows yet, see below; `test-cloudflare-windows`
instead exercises the Node fs helpers there).

## Tests

```bash
yarn test      # pytest — the Worker runtime modules and the Python vendoring helper (needs uv)
yarn test:js   # node:test — the cross-platform Node fs helpers (src/helpers/)
yarn typecheck # tsc over src/ (the build also emits dist/*.d.ts from these sources)
```

The dist-info-aware vendoring (RECORD parsing, wheel extraction, package
matching) lives in `py/vendor_python_modules.py` and runs inside the output
project's venv, so it leans on `importlib.metadata`/`zipfile`/`tarfile` instead
of reimplementing them; pytest covers it. The Node-side fs helper tests are
pure Node and run on every OS.

## Architecture direction: media across isolates

Cloudflare routes a session's WebSocket and its HTTP media fetches to
different isolates, while Streamlit keeps media bytes in the session
isolate's memory; `py/stlite_cloudflare/media_cache.py` bridges this with a
colo-local Cache API mirror. Its docstring records the limits of that bridge.
The default Durable Object deployment (`py/stlite_cloudflare/durable.py`)
removes the problem at the root by giving the resident runtime a single
addressable home; the Cache API mirror exists for the `--plain-worker`
opt-out, where it bridges media only — uploads are read through a
synchronous API the async cache cannot back, which is the reason the
Durable Object is the default rather than the other way around.

## Architecture direction: the ASGI bridge

`py/stlite_cloudflare/adapter.py` and `websocket.py` hand-roll the
ASGI-over-workerd bridge instead of using the `asgi` module that
workers-runtime-sdk ships, because that module (as of 1.6.2) runs a fresh ASGI
lifespan per request (Streamlit's runtime must stay resident), only supports
text WebSocket frames (Streamlit's transport is binary protobuf), and leaves
nowhere to strip `accept-encoding` or inject the frontend config into the
index HTML.

The frontend (including the index HTML, with the Streamlit config baked in
at build time) is served by Cloudflare's static-assets layer, and the heavy
Python runtime ships the same way: Workers cap the script at 3/10 MiB gzip
(free/paid) while Streamlit's dependency closure alone gzips to ~14 MiB, so
the script keeps only `stlite_cloudflare`, the workers SDK, and the
native-extension packages (workerd dlopens `.so` only from the script's
read-only mount), and `package_loader.py` activates the rest from
`assets/_stlite/` at cold start: `python-modules.zip` goes onto sys.path
directly (zipimport, so the libraries never occupy the in-memory
filesystem), and `extracted-modules.tar.gz` (the app plus namespace
packages, which zipimport can't serve) is extracted to real files —
all before the first `import streamlit`. The `--bundled-runtime` build flag
skips the asset split entirely (the loader detects the bundled layout and
fetches nothing); once Cloudflare's planned 64 MB-uncompressed script limit
ships ([workers-py#156](https://github.com/cloudflare/workers-py/issues/156)),
consider making it the default — the full post-prune bundle measures under
that limit. The bridge's one remaining HTTP-shaping concern is the
`accept-encoding` strip. The
intended evolution is to move that into a pure-Python ASGI middleware wrapping
the Starlette app, leaving the bridge generic (directly replaceable by the
upstream `asgi` module if it gains a resident-lifespan mode and binary
WebSocket support) and free to stream response bodies, which it currently
buffers.
