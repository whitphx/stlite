# @stlite/cli

## 0.1.3

### Patch Changes

- [#2086](https://github.com/whitphx/stlite/pull/2086) [`a90f9a9`](https://github.com/whitphx/stlite/commit/a90f9a9bacedcd9432e28c143a9c4c1ba071d95b) Thanks [@whitphx](https://github.com/whitphx)! - Set up the automated npm release pipeline for `@stlite/cli`.

## 0.1.2

### Patch Changes

- [#2077](https://github.com/whitphx/stlite/pull/2077) [`e72edf6`](https://github.com/whitphx/stlite/commit/e72edf6c155b27e4878e413b6c1f731734932b13) Thanks [@whitphx](https://github.com/whitphx)! - Load each target's runtime package (`@stlite/browser`, `@stlite/desktop`, `@stlite/cloudflare`) lazily instead of depending on them at runtime, so an install that omits a target still works for the others and the heavy per-target artifacts are not pulled in unless requested. Each command reports a clear "install …" message when its target's package is missing, and verifies the installed version satisfies the range this CLI supports — failing loudly and actionably instead of silently mishandling a drifted plugin interface.

- [#2077](https://github.com/whitphx/stlite/pull/2077) [`e72edf6`](https://github.com/whitphx/stlite/commit/e72edf6c155b27e4878e413b6c1f731734932b13) Thanks [@whitphx](https://github.com/whitphx)! - Retry the micropip dependency-resolution step during packaging with exponential backoff, so a transient PyPI hiccup ("Can't find a pure Python 3 wheel for …") no longer fails the build.

## 0.1.1

### Patch Changes

- Updated dependencies [[`992dda0`](https://github.com/whitphx/stlite/commit/992dda0c6a8db5625ea62e90216824c35b25b032)]:
  - @stlite/browser@1.8.0
  - @stlite/desktop@0.101.0

## 0.1.0

### Minor Changes

- [#2020](https://github.com/whitphx/stlite/pull/2020) [`0e9ee30`](https://github.com/whitphx/stlite/commit/0e9ee30bc6214830eec88d8f61ffa01f235c604c) Thanks [@whitphx](https://github.com/whitphx)! - Add `@stlite/cli` (npm) and `stlite-cli` (PyPI / uv) — a unified `stlite` CLI with four conversion commands:

  - `stlite share <path>` — convert a local Streamlit project into a Stlite Sharing URL (Node + Python; produce byte-identical URLs across runtimes).
  - `stlite html <path>` — convert into a single self-contained HTML file that loads `@stlite/browser` from JSDelivr (Node + Python; byte-identical output).
  - `stlite web <path>` — convert into a multi-file Stlite web app directory that runs offline on any HTTP server (Node only).
  - `stlite desktop <path>` — convert into a Stlite Desktop project directory with `stlite-manifest.json` (Node only).

  Supporting changes:

  - New `@stlite/app-packager` library extracts the dump-artifacts pipeline (Pyodide vendoring, site-packages snapshot) so both `stlite web`/`desktop` and `@stlite/desktop`'s existing bin can share it.
  - `@stlite/sharing-common` now owns `exportAsHtml` (moved from `@stlite/sharing-editor`) with a parameterized `(appData, { runtimeVersion, debugComment? })` signature, plus a stable `BASE64_DECODER_JS_SOURCE` constant for the embedded HTML decoder. Bug fix: `compress.ts` now uses `.replaceAll` so the URL hash is true base64url; `buffer.ts` uses globals so the package loads in Node.
  - `@stlite/desktop`'s `dump-stlite-desktop-artifacts` bin is **deprecated** (emits a `DeprecationWarning` at startup) in favor of `stlite desktop`. The bin keeps working for one release. Also exposes `dumpManifest` and the manifest schema via `build/electron/manifest.js` (ESM) so `@stlite/cli` can reuse them.

### Patch Changes

- Updated dependencies [[`0e9ee30`](https://github.com/whitphx/stlite/commit/0e9ee30bc6214830eec88d8f61ffa01f235c604c), [`bbc1c86`](https://github.com/whitphx/stlite/commit/bbc1c863f632449e131affc5a9ab16e703b82315)]:
  - @stlite/desktop@0.100.0
  - @stlite/browser@1.7.3
