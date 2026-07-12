# @stlite/cloudflare

`@stlite/cloudflare` packages the stlite-patched Streamlit runtime for
Cloudflare Python Workers. It provides a Worker runtime bridge, a project
scaffold, and build commands that vendor the Pyodide-compatible Python
dependency tree needed by Cloudflare.

## Create an app

```bash
npx @stlite/cloudflare init my-app
cd my-app
npm install
npm run dev
```

`init` requires an empty (or not yet existing) directory; the generated
`package.json` already declares `@stlite/cloudflare` and `wrangler` as
dev dependencies.

Until the package publishes versioned runtime artifacts, this development build
must run from the Stlite monorepo sample:

```bash
yarn workspace stlite-cloudflare-sample-hello dev
```

## CLI

```bash
stlite-cloudflare init [dir]
stlite-cloudflare build
stlite-cloudflare dev -- --port 8787
stlite-cloudflare deploy
stlite-cloudflare clean
```

`init` creates a standard Cloudflare Workers project whose `src/entry.py` imports
`stlite_cloudflare.entry.Default`. `build`, `dev`, and `deploy` package the app
under `app/` into `_stlite_cloudflare_app`, run `pywrangler sync`, overlay the
stlite-pinned Streamlit runtime, and copy the Worker bridge into
`python_modules`.

## Generated project

```text
app/streamlit_app.py
src/entry.py
wrangler.jsonc
pyproject.toml
package.json
```

`wrangler.jsonc` remains the Cloudflare deployment source of truth. The build
packages the `app/` directory and serves `app/streamlit_app.py` as the
Streamlit entrypoint.

## Release artifact TODO

The current source-tree build still compiles `stlite-lib`, the stlite-pinned
Streamlit wheel, and the Cloudflare-compatible frontend from the monorepo. A
publishable release should replace that with bundled or downloaded versioned
runtime artifacts so generated user projects do not need the Stlite repository.
