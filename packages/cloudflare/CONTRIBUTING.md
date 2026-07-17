# Contributing to `@stlite/cloudflare`

## Build modes

The vendoring runs in one of two modes, chosen automatically:

- **Bundled** — a published package ships prebuilt runtime artifacts (`runtime/`,
  `dist/`) and builds without the monorepo. This is the end-user path; it is
  cross-platform (Windows/macOS/Linux) and needs only `uv` and Node.js.
- **Monorepo** — run from the Stlite source tree, the build compiles
  `stlite-lib`, the stlite-pinned Streamlit wheel, and the Cloudflare-variant
  Streamlit frontend from the workspace.

The monorepo build additionally spawns `make`, `corepack yarn`, and `git`, so it
needs `make` and a POSIX shell — on Windows use WSL. Installing the published
package avoids all of that.

## Release artifacts

`scripts/build-runtime.mjs` produces the `runtime/` artifacts (frontend, wheels,
`streamlit-dependencies.json`) that the bundled mode ships. The intent is that a
publishable release contains everything needed to build a Worker without the
Stlite repository or its `streamlit` submodule; `verify-cloudflare-standalone`
in CI proves that by building from the packed tarball alone (on Linux and
Windows).

## Tests

```bash
yarn test      # pytest — the Worker runtime Python modules (needs uv)
yarn test:js   # node:test — the cross-platform vendoring helpers (src/helpers/)
```

The helper unit tests are pure Node and run on every OS; they guard the
archive-extraction, directory-mirroring, and site-packages copy logic that
replaced the old `bash`/`python3`/`tar`/`rsync` shell-outs.
