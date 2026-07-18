# Contributing to `@stlite/cloudflare`

## Building

`stlite-cloudflare build` vendors a project against the package's **prebuilt
runtime artifacts** (`runtime/`, `dist/`). This is the only vendoring path — it
is cross-platform (Windows/macOS/Linux) and needs only `uv` and Node.js. A
published package ships those artifacts.

In a fresh monorepo checkout they don't exist yet; run `make cloudflare` first to
produce them (it compiles `stlite-lib`, the stlite-pinned Streamlit wheel, and
the Cloudflare-variant Streamlit frontend, and bundles the vendoring script).
`make cloudflare` spawns `make`, `corepack yarn`, and `git`, so it needs `make`
and a POSIX shell — on Windows, build under WSL or use the published package.

## Release artifacts

`scripts/build-runtime.mjs` produces the `runtime/` artifacts (frontend, wheels,
`streamlit-dependencies.json`) that the bundled mode ships. The intent is that a
publishable release contains everything needed to build a Worker without the
Stlite repository or its `streamlit` submodule; `verify-cloudflare-standalone`
in CI proves that by building from the packed tarball alone (Linux only — the
full build can't run on Windows yet, see below; `test-cloudflare-windows`
instead exercises the pure-Node vendoring helpers there).

## Tests

```bash
yarn test      # pytest — the Worker runtime Python modules (needs uv)
yarn test:js   # node:test — the cross-platform vendoring helpers (src/helpers/)
```

The helper unit tests are pure Node and run on every OS; they guard the
archive-extraction, directory-mirroring, and site-packages copy logic that
replaced the old `bash`/`python3`/`tar`/`rsync` shell-outs.
