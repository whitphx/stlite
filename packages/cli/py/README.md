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
