# @stlite/cli

## 0.2.0

### Minor Changes

- [#2110](https://github.com/whitphx/stlite/pull/2110) [`e56275c`](https://github.com/whitphx/stlite/commit/e56275c7ef594260b944403d9a5f6e2fea275b46) Thanks [@whitphx](https://github.com/whitphx)! - Rebase the Streamlit fork onto 1.62.0, picking up everything upstream shipped across 1.58 through 1.62.
  
  Streamlit removed Base Web (`baseui` and `styletron-*`) from its frontend over those releases, so `@stlite/react` no longer mounts the `StyletronProvider` and `BaseProvider` wrappers. The `BaseProvider` also restated the app's text styles on Base Web's portal host, which stlite needs because it scopes those styles to the `stlite-root` element rather than to `body`; overlays now portal through Streamlit's own `PortalProvider`, so those styles move onto the hosts it marks with `data-st-overlay-root`.
  
  Streamlit's new lazy dataframe delivery stays off under stlite. It slices a `pyarrow.Table` per chunk, and pyarrow has no Pyodide build, so `st.dataframe` keeps rendering through the existing eager Parquet path at every size. Passing `lazy=True` explicitly now raises a `StreamlitAPIException` instead of failing inside the pyarrow stub.
  
  Two other new upstream features start OS threads, which Pyodide refuses. `@st.fragment(parallel=True)` now runs its fragment inline, and `st.skeleton()` used as a context manager schedules its delayed reveal on an asyncio task, matching what `st.spinner` already does.
  
  Shared frontend dependencies in `packages/*` follow upstream: `typescript` ^6.0.3, `vite` ^8.2.1, `vitest` ^4.1.10, `vite-plugin-dts` ^5.0.3, `protobufjs` ^8.7.2. `@stlite/react` keeps its documented `vite` ^7.1.5 pin.

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
