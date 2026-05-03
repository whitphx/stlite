---
"@stlite/cli": minor
"@stlite/app-packager": minor
"@stlite/desktop": minor
"@stlite/sharing-common": minor
"@stlite/sharing-editor": patch
---

Add `@stlite/cli` (npm) and `stlite-cli` (PyPI / uv) — a unified `stlite` CLI with four conversion commands:

- `stlite share <path>` — convert a local Streamlit project into a Stlite Sharing URL (Node + Python; produce byte-identical URLs across runtimes).
- `stlite html <path>` — convert into a single self-contained HTML file that loads `@stlite/browser` from JSDelivr (Node + Python; byte-identical output).
- `stlite web <path>` — convert into a multi-file Stlite web app directory that runs offline on any HTTP server (Node only).
- `stlite desktop <path>` — convert into a Stlite Desktop project directory with `stlite-manifest.json` (Node only).

Supporting changes:

- New `@stlite/app-packager` library extracts the dump-artifacts pipeline (Pyodide vendoring, site-packages snapshot) so both `stlite web`/`desktop` and `@stlite/desktop`'s existing bin can share it.
- `@stlite/sharing-common` now owns `exportAsHtml` (moved from `@stlite/sharing-editor`) with a parameterized `(appData, { runtimeVersion, debugComment? })` signature, plus a stable `BASE64_DECODER_JS_SOURCE` constant for the embedded HTML decoder. Bug fix: `compress.ts` now uses `.replaceAll` so the URL hash is true base64url; `buffer.ts` uses globals so the package loads in Node.
- `@stlite/desktop`'s `dump-stlite-desktop-artifacts` bin is **deprecated** (emits a `DeprecationWarning` at startup) in favor of `stlite desktop`. The bin keeps working for one release. Also exposes `dumpManifest` and the manifest schema via `build/electron/manifest.js` (ESM) so `@stlite/cli` can reuse them.
