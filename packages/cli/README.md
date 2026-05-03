# @stlite/cli

Command-line tools for converting a local Streamlit project into a Stlite app.

```sh
npx @stlite/cli <command> <path>
# or, after global install:
npm install -g @stlite/cli
stlite <command> <path>
```

A Python distribution with the same `stlite` bin is also available on PyPI as
`stlite-cli` — `pip install stlite-cli` or `uvx stlite-cli`. The Python CLI
covers `share` and `html` (which produce byte-identical output to the JS
version); `web` and `desktop` are Node-only because they rely on
Pyodide-in-Node tooling.

## Commands

### `stlite share <path>`

Encode a project into a hash-fragment URL that loads on
<https://share.stlite.net/>. The whole project (text + binary files +
requirements) gets serialized as a protobuf, base64url-encoded, and embedded in
the URL hash.

```sh
stlite share ./my-project
# https://share.stlite.net/#!CgZhcHAucHkS...
```

`--editable` switches the base URL to `https://edit.share.stlite.net/` (the
sharing editor).

### `stlite html <path>`

Generate a single self-contained `.html` file that loads
[`@stlite/browser`](../browser) from JSDelivr and embeds the project's files
inline (text via JS template literals, binary via base64). Default output is
stdout; pass `-o file.html` to write to disk.

```sh
stlite html ./my-project -o app.html
```

`--runtime-version <ver>` pins the `@stlite/browser` version the exported page
loads from JSDelivr.

### `stlite web <path>`

Package the project into a multi-file directory that runs offline on any HTTP
server. The output bundles `@stlite/browser`'s SPA, the Pyodide runtime, and a
pre-vendored site-packages snapshot, so users don't fetch anything from a CDN
at boot. Output goes to `./build` by default; override with `-o`.

```sh
stlite web ./my-project -o ./out
python3 -m http.server -d ./out  # serves the app at http://localhost:8000/
```

### `stlite desktop <path>`

Package the project into a Stlite Desktop directory (multi-file artifact +
`stlite-manifest.json`) that's consumed by `electron-builder` to produce a
standalone Electron app. Replaces the deprecated
`dump-stlite-desktop-artifacts` bin from `@stlite/desktop`. Pass
`--manifest <jsonpath>` to override manifest fields (`embed`, `nodeJsWorker`,
mountpoints, etc.).

## Common options

All four commands accept:

- `<path>` — the project directory (positional, required)
- `--entrypoint <name>` — entrypoint script, default `app.py`
- `--requirements <path>` — explicit requirements.txt; defaults to
  `<path>/requirements.txt` if present.

`web` and `desktop` additionally accept `-o, --out <dir>` and
`--pyodideSource <url>`.
