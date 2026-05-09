# @stlite/app-packager

Internal library that vendors a Streamlit project's Python dependencies into a
multi-file Stlite artifact, used by both `@stlite/desktop`'s
`dump-stlite-desktop-artifacts` bin and `@stlite/cli`'s `web` / `desktop`
commands.

> [!NOTE]
> This package is `private: true` — it isn't published to npm and isn't part
> of Stlite's public API. The interface is allowed to change between Stlite
> releases. Consumers should be Stlite-internal only.

## What `packageApp` produces

Given a destination directory `destDir`, a project source directory, a list of
files to copy, an entrypoint, and a list of Python requirements, `packageApp`
adds the following under `destDir`:

- `app_files/` — user code (matched by the `files` glob patterns).
- `pyodide/` — Pyodide's package cache, populated with whichever prebuilt
  wheels the requirements pull in.
- `site-packages-snapshot.tar.gz` — a tarball of pure-Python deps installed in
  a Pyodide-in-Node sandbox, with prebuilt packages mocked out so they don't
  duplicate.
- `prebuilt-packages.txt` — the names the runtime should load via
  `pyodide.loadPackage()` at boot.

`packageApp` does **not** copy any host-specific shell (SPA bundle,
`stlite-manifest.json`, `index.html`, etc.) — that is the caller's
responsibility, so the same primitive serves both:

- `stlite desktop` (copies `@stlite/desktop`'s CRA SPA + writes an Electron
  manifest), and
- `stlite web` (copies `@stlite/browser`'s SPA + writes a minimal `index.html`
  that calls `mount()` with relative URLs).

## Other exports

- `copyPyodideRuntime(destPyodideDir)` — copy `pyodide.mjs`,
  `pyodide.asm.{js,wasm}`, `python_stdlib.zip`, and `pyodide-lock.json` from
  the installed `pyodide` npm package so the artifact boots offline.
- `readRequirementsTxt(path)` — parse a `requirements.txt` via
  `@stlite/common`'s `parseRequirementsTxt`.
- `Logger` / `consoleLogger` — minimal structured-logging interface so
  consumers can wire their own logger (e.g. desktop's `winston`).
- `DEFAULT_PYODIDE_SOURCE`, `normalizePyodideSource(urlOrPath)`.
- `PrebuiltPackagesDataReader` — reads `pyodide-lock.json` from a Pyodide CDN
  URL or local path.
