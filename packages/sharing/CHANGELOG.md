# @stlite/sharing

## 0.98.1

### Patch Changes

- [#2124](https://github.com/whitphx/stlite/pull/2124) [`e805cae`](https://github.com/whitphx/stlite/commit/e805cae984bb372414bc3938c5109bf6a8aef840) Thanks [@whitphx](https://github.com/whitphx)! - Wait for `parquet-wasm` to finish instantiating before parsing a dataframe.
  
  Stlite parses Arrow payloads through `parquet-wasm`, whose reader throws until its WebAssembly module is instantiated. The initializer was started but never awaited, so an app that rendered a dataframe or an Arrow-backed chart before the 5.5 MB module finished loading took the page down with `Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')`. Bundling the Python runtime into the Cloudflare Worker script made that the common case rather than a rare one, because the app now boots without waiting on a runtime download first.
- Updated dependencies [[`e805cae`](https://github.com/whitphx/stlite/commit/e805cae984bb372414bc3938c5109bf6a8aef840)]:
  - @stlite/react@1.8.1

## 0.98.0

### Minor Changes

- [#2110](https://github.com/whitphx/stlite/pull/2110) [`e56275c`](https://github.com/whitphx/stlite/commit/e56275c7ef594260b944403d9a5f6e2fea275b46) Thanks [@whitphx](https://github.com/whitphx)! - Rebase the Streamlit fork onto 1.62.0, picking up everything upstream shipped across 1.58 through 1.62.
  
  Streamlit removed Base Web (`baseui` and `styletron-*`) from its frontend over those releases, so `@stlite/react` no longer mounts the `StyletronProvider` and `BaseProvider` wrappers. The `BaseProvider` also restated the app's text styles on Base Web's portal host, which stlite needs because it scopes those styles to the `stlite-root` element rather than to `body`; overlays now portal through Streamlit's own `PortalProvider`, so those styles move onto the hosts it marks with `data-st-overlay-root`.
  
  Streamlit's new lazy dataframe delivery stays off under stlite. It slices a `pyarrow.Table` per chunk, and pyarrow has no Pyodide build, so `st.dataframe` keeps rendering through the existing eager Parquet path at every size. Passing `lazy=True` explicitly now raises a `StreamlitAPIException` instead of failing inside the pyarrow stub.
  
  Two other new upstream features start OS threads, which Pyodide refuses. `@st.fragment(parallel=True)` now runs its fragment inline, and `st.skeleton()` used as a context manager schedules its delayed reveal on an asyncio task, matching what `st.spinner` already does.
  
  Shared frontend dependencies in `packages/*` follow upstream: `typescript` ^6.0.3, `vite` ^8.2.1, `vitest` ^4.1.10, `vite-plugin-dts` ^5.0.3, `protobufjs` ^8.7.2. `@stlite/react` keeps its documented `vite` ^7.1.5 pin.

### Patch Changes

- Updated dependencies [[`e56275c`](https://github.com/whitphx/stlite/commit/e56275c7ef594260b944403d9a5f6e2fea275b46)]:
  - @stlite/react@1.8.0

## 0.97.0

### Minor Changes

- [#2046](https://github.com/whitphx/stlite/pull/2046) [`992dda0`](https://github.com/whitphx/stlite/commit/992dda0c6a8db5625ea62e90216824c35b25b032) Thanks [@whitphx](https://github.com/whitphx)! - Rebase Streamlit fork onto 1.57.0.

  Internally, the kernel switches from the hand-rolled `stlite_lib.server.Server` HTTP/WS dispatcher to calling upstream Streamlit's Starlette ASGI app directly via a new ASGI bridge (`stlite_lib.asgi_app` on the Python side, `packages/kernel/src/asgi-bridge.ts` on the JS side). User-visible API surface is unchanged.

  To make upstream's Starlette routes work in Pyodide's single-threaded WASM environment, `stlite_lib.anyio_patch` replaces `anyio`'s `run_sync_in_worker_thread` with an inline implementation at package import. This keeps Custom Components, app-static file serving, and other anyio-backed I/O working without spawning worker threads.

### Patch Changes

- Updated dependencies [[`992dda0`](https://github.com/whitphx/stlite/commit/992dda0c6a8db5625ea62e90216824c35b25b032)]:
  - @stlite/react@1.7.0

## 0.96.3

### Patch Changes

- Updated dependencies [[`0e9ee30`](https://github.com/whitphx/stlite/commit/0e9ee30bc6214830eec88d8f61ffa01f235c604c), [`bbc1c86`](https://github.com/whitphx/stlite/commit/bbc1c863f632449e131affc5a9ab16e703b82315)]:
  - @stlite/sharing-common@0.91.0
  - @stlite/react@1.6.3

## 0.96.2

### Patch Changes

- [#1999](https://github.com/whitphx/stlite/pull/1999) [`07500cc`](https://github.com/whitphx/stlite/commit/07500cc5e8d054ad0fc9055d7680583e14539f7f) Thanks [@whitphx](https://github.com/whitphx)! - Replace ESLint and Prettier with Oxc (oxlint + oxfmt) for linting and formatting. Dev tooling only — no runtime or API change.

- Updated dependencies [[`07500cc`](https://github.com/whitphx/stlite/commit/07500cc5e8d054ad0fc9055d7680583e14539f7f)]:
  - @stlite/react@1.6.2
  - @stlite/sharing-common@0.90.3

## 0.96.1

### Patch Changes

- [#1991](https://github.com/whitphx/stlite/pull/1991) [`f24c351`](https://github.com/whitphx/stlite/commit/f24c351146002a036e32ca4e56e395a6ee472fb9) Thanks [@whitphx](https://github.com/whitphx)! - Update web-vitals to 5.2.0 and replace the removed `onFID` metric with `onINP`.

## 0.96.0

### Minor Changes

- [#1971](https://github.com/whitphx/stlite/pull/1971) [`1f91a44`](https://github.com/whitphx/stlite/commit/1f91a44d6a89c3f38743ce7f34b9027d05cfab65) Thanks [@whitphx](https://github.com/whitphx)! - Rebase Streamlit fork onto 1.56.0.

### Patch Changes

- Updated dependencies [[`1f91a44`](https://github.com/whitphx/stlite/commit/1f91a44d6a89c3f38743ce7f34b9027d05cfab65)]:
  - @stlite/react@1.6.0

## 0.95.1

### Patch Changes

- [#1973](https://github.com/whitphx/stlite/pull/1973) [`c69cf7b`](https://github.com/whitphx/stlite/commit/c69cf7bea70c56ca53ce7b199f27ab5ec2aeb2d7) Thanks [@whitphx](https://github.com/whitphx)! - Trigger a new release because the previous release failed due to a bug addressed by [#1972](https://github.com/whitphx/stlite/issues/1972). The release contains "52568e5 Thanks @whitphx! - Update Streamlit to 1.54.0" and "[#1967](https://github.com/whitphx/stlite/issues/1967) 9d0d501 Thanks @whitphx! - Update Streamlit to 1.55.0"

- Updated dependencies [[`c69cf7b`](https://github.com/whitphx/stlite/commit/c69cf7bea70c56ca53ce7b199f27ab5ec2aeb2d7)]:
  - @stlite/sharing-common@0.90.2
  - @stlite/react@1.5.1

## 0.95.0

### Minor Changes

- [`cdeb54a`](https://github.com/whitphx/stlite/commit/cdeb54a521b80fe39cbf0538dfd4f12c4a7e9859) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.52.2 (https://github.com/whitphx/stlite/pull/1919)

### Patch Changes

- Updated dependencies [[`cdeb54a`](https://github.com/whitphx/stlite/commit/cdeb54a521b80fe39cbf0538dfd4f12c4a7e9859)]:
  - @stlite/react@1.3.0

## 0.94.0

### Minor Changes

- [#1893](https://github.com/whitphx/stlite/pull/1893) [`6991477`](https://github.com/whitphx/stlite/commit/6991477416911a49044fbbe266ac338fecfd5b40) Thanks [@whitphx](https://github.com/whitphx)! - Update Pyodide to 0.29.3

### Patch Changes

- Updated dependencies [[`a3aa0fb`](https://github.com/whitphx/stlite/commit/a3aa0fb70ec631aba6e7f73dec74b10236518da5), [`6991477`](https://github.com/whitphx/stlite/commit/6991477416911a49044fbbe266ac338fecfd5b40)]:
  - @stlite/react@1.2.0

## 0.93.0

### Minor Changes

- [#1871](https://github.com/whitphx/stlite/pull/1871) [`aef1b94`](https://github.com/whitphx/stlite/commit/aef1b94a97229e11a80836454afcd4ab2334a23f) Thanks [@whitphx](https://github.com/whitphx)! - Update Streamlit to 1.51.0

### Patch Changes

- Updated dependencies [[`aef1b94`](https://github.com/whitphx/stlite/commit/aef1b94a97229e11a80836454afcd4ab2334a23f)]:
  - @stlite/react@1.1.0

## 0.92.2

### Patch Changes

- Updated dependencies [[`813b89e`](https://github.com/whitphx/stlite/commit/813b89e12eaf11e6522aedd75b57ba7bfb2a8bb4)]:
  - @stlite/react@1.0.0

## 0.92.1

### Patch Changes

- Updated dependencies [[`8ff48cf`](https://github.com/whitphx/stlite/commit/8ff48cf899099f67267a5f3ada328240b28e5127), [`3436a4c`](https://github.com/whitphx/stlite/commit/3436a4ceee1c20ae06534693a0be2b3bc464f13d)]:
  - @stlite/react@0.3.0

## 0.92.0

### Minor Changes

- [#1807](https://github.com/whitphx/stlite/pull/1807) [`6f8ed99`](https://github.com/whitphx/stlite/commit/6f8ed99e53191319d6911d67876e5de8178311d6) Thanks [@whitphx](https://github.com/whitphx)! - Fix style structure to provide an option to encapsulate the style in each mounted app

### Patch Changes

- Updated dependencies [[`381d7d3`](https://github.com/whitphx/stlite/commit/381d7d30e0b12edba6852e47eb94f3e826b1cdb3), [`6f8ed99`](https://github.com/whitphx/stlite/commit/6f8ed99e53191319d6911d67876e5de8178311d6)]:
  - @stlite/react@0.2.0

## 0.91.2

### Patch Changes

- [`2722b06`](https://github.com/whitphx/stlite/commit/2722b06dbf7b1c262ddc1bf14f0ae1d74ca11556) Thanks [@whitphx](https://github.com/whitphx)! - Trigger release for https://github.com/whitphx/stlite/pull/1808 (Fix the race condition at the server initialization in SharedWorker mode) and https://github.com/whitphx/stlite/pull/1810 (Hook the task switch to reset the per-app CWD and home dir)

- Updated dependencies [[`2722b06`](https://github.com/whitphx/stlite/commit/2722b06dbf7b1c262ddc1bf14f0ae1d74ca11556)]:
  - @stlite/react@0.1.1

## 0.91.1

### Patch Changes

- [#1754](https://github.com/whitphx/stlite/pull/1754) [`5782557`](https://github.com/whitphx/stlite/commit/5782557ada0f661aadd64ffb7071ec0f148665da) Thanks [@whitphx](https://github.com/whitphx)! - Internal package structure update

- Updated dependencies []:
  - @stlite/react@0.1.0

## 0.91.0

### Minor Changes

- [#1696](https://github.com/whitphx/stlite/pull/1696) [`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457) Thanks [@whitphx](https://github.com/whitphx)! - Use @stlite/react as the foundation instead of depending on @stlite/kernel directly

### Patch Changes

- Updated dependencies [[`7d71211`](https://github.com/whitphx/stlite/commit/7d71211b376e58609e272db288663bf522830457)]:
  - @stlite/react@0.1.0

## 0.90.4

### Patch Changes

- [#1716](https://github.com/whitphx/stlite/pull/1716) [`ee73e8c`](https://github.com/whitphx/stlite/commit/ee73e8c82d16602b3b72a1ec5d86c356b37b66b9) Thanks [@whitphx](https://github.com/whitphx)! - Update protoc to 26.1

- [#1715](https://github.com/whitphx/stlite/pull/1715) [`6dc03af`](https://github.com/whitphx/stlite/commit/6dc03af5f84964b1adf3ad4112287fe3f9c3c17e) Thanks [@whitphx](https://github.com/whitphx)! - Move ConnectionManager to @stlite/kernel to avoid circular dependency between @stlite/kernel and @streamlit/connection

- Updated dependencies [[`ee73e8c`](https://github.com/whitphx/stlite/commit/ee73e8c82d16602b3b72a1ec5d86c356b37b66b9), [`6dc03af`](https://github.com/whitphx/stlite/commit/6dc03af5f84964b1adf3ad4112287fe3f9c3c17e)]:
  - @stlite/kernel@0.92.1

## 0.90.3

### Patch Changes

- [#1711](https://github.com/whitphx/stlite/pull/1711) [`a97285c`](https://github.com/whitphx/stlite/commit/a97285c82f718d6849965cfcd348f87d7fe8f835) Thanks [@whitphx](https://github.com/whitphx)! - Fix toast callback mechanism

- [#1712](https://github.com/whitphx/stlite/pull/1712) [`306c18c`](https://github.com/whitphx/stlite/commit/306c18cb81d500375c31c6e7ff62ab135ca446ff) Thanks [@whitphx](https://github.com/whitphx)! - Use event-listener-based toasts

- Updated dependencies [[`a97285c`](https://github.com/whitphx/stlite/commit/a97285c82f718d6849965cfcd348f87d7fe8f835), [`306c18c`](https://github.com/whitphx/stlite/commit/306c18cb81d500375c31c6e7ff62ab135ca446ff), [`a97285c`](https://github.com/whitphx/stlite/commit/a97285c82f718d6849965cfcd348f87d7fe8f835), [`306c18c`](https://github.com/whitphx/stlite/commit/306c18cb81d500375c31c6e7ff62ab135ca446ff), [`d1a53e5`](https://github.com/whitphx/stlite/commit/d1a53e53496514c3e441507038d7634da9c620b6)]:
  - @stlite/common-react@0.91.0
  - @stlite/kernel@0.92.0
  - @streamlit/app@1.50.1

## 0.90.2

### Patch Changes

- Updated dependencies [[`ed1a48b`](https://github.com/whitphx/stlite/commit/ed1a48bccfd51dbae1c643baccfa5b7932c25f86)]:
  - @stlite/kernel@0.91.0
  - @stlite/common-react@0.90.2
  - @streamlit/app@1.50.1

## 0.90.1

### Patch Changes

- [#1630](https://github.com/whitphx/stlite/pull/1630) [`ef83ced`](https://github.com/whitphx/stlite/commit/ef83ced9f3543587007a02be377a8920f919ec00) Thanks [@whitphx](https://github.com/whitphx)! - Introduce Changesets for publishing workflow
