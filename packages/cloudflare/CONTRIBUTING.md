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

`scripts/build-runtime.mjs` produces the `runtime/` artifacts (frontend, wheels,
`streamlit-dependencies.json`) that the bundled mode ships. The intent is that a
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
