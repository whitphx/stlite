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
the script keeps only `stlite_cloudflare` plus the workers SDK, and
`package_loader.py` fetches `assets/_stlite/python-modules.tar.gz` through
the ASSETS binding at cold start and extracts it before the first
`import streamlit`. The bridge's one remaining HTTP-shaping concern is the
`accept-encoding` strip. The
intended evolution is to move that into a pure-Python ASGI middleware wrapping
the Starlette app, leaving the bridge generic (directly replaceable by the
upstream `asgi` module if it gains a resident-lifespan mode and binary
WebSocket support) and free to stream response bodies, which it currently
buffers.
