# @stlite/cloudflare

`@stlite/cloudflare` packages the stlite-patched Streamlit runtime for
Cloudflare Python Workers. It provides a Worker runtime bridge, a project
scaffold, and build commands that vendor the Pyodide-compatible Python
dependency tree needed by Cloudflare.

## Create an app

```bash
mkdir my-app
cd my-app
npm init -y
npm install -D @stlite/cloudflare wrangler
npx stlite-cloudflare init .
npm run dev
```

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
stlite-cloudflare.toml
wrangler.jsonc
pyproject.toml
package.json
```

`wrangler.jsonc` remains the Cloudflare deployment source of truth. The
`stlite-cloudflare.toml` file records the Streamlit app entrypoint and package
inclusion policy; the current build uses the default `app/` layout.

## Release artifact TODO

The current source-tree build still compiles `stlite-lib`, the stlite-pinned
Streamlit wheel, and the Cloudflare-compatible frontend from the monorepo. A
publishable release should replace that with bundled or downloaded versioned
runtime artifacts so generated user projects do not need the Stlite repository.
