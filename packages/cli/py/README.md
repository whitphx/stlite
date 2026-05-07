# stlite-cli

Python distribution of the Stlite command-line tools. The `stlite` entry point
exposes a subset of the JS [`@stlite/cli`](../) commands — `share` and `html` —
that produce byte-identical output across both runtimes. The `web` and
`desktop` commands need Pyodide-in-Node tooling and are therefore Node-only;
use `npx @stlite/cli web|desktop` for those.

## Install

```sh
pip install stlite-cli   # or: uvx stlite-cli
```

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
[`@stlite/browser`](../../browser) from JSDelivr and embeds the project's files
inline (text via JS template literals, binary via base64). Default output is
stdout; pass `-o file.html` to write to disk.

```sh
stlite html ./my-project -o app.html
```

`--runtime-version <ver>` pins the `@stlite/browser` version the exported page
loads from JSDelivr.

## Common options

Both commands accept:

- `<path>` — the project directory (positional, required)
- `--entrypoint <name>` — entrypoint script, default `app.py`
- `--requirements <path>` — explicit requirements.txt; defaults to
  `<path>/requirements.txt` if present.
