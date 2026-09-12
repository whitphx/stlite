# @stlite/cloudflare

## 0.4.0

### Minor Changes

- [#2115](https://github.com/whitphx/stlite/pull/2115) [`5e87ca9`](https://github.com/whitphx/stlite/commit/5e87ca9062c3fdeb09893a192b3a21f063e21720) Thanks [@whitphx](https://github.com/whitphx)! - Bundle the Python runtime into the Worker script by default. Cloudflare now caps a script at 64 MiB uncompressed on every plan instead of 3 MiB (Free) or 10 MiB (Paid) after gzip, and the packaged runtime fits that with room to spare, so a cold start no longer fetches and unpacks the runtime from static assets before the first `import streamlit`.
  
  The previous layout is still available as `--asset-runtime`, which keeps the packed libraries compressed in the isolate and is worth the extra cold-start work for an app running close to the 128 MB isolate limit.

- [#2123](https://github.com/whitphx/stlite/pull/2123) [`f7af537`](https://github.com/whitphx/stlite/commit/f7af537e00862cc6babebe9d33a04165c78077d2) Thanks [@whitphx](https://github.com/whitphx)! - Remove the `--bundled-runtime` flag. Bundling the Python runtime into the Worker script is the default, so the flag selected the behaviour you already get; `--asset-runtime` is the flag that changes it. Builds still passing `--bundled-runtime` now fail with an unknown-argument error instead of being silently ignored, and the fix is to drop it from the command.

### Patch Changes

- [#2124](https://github.com/whitphx/stlite/pull/2124) [`e805cae`](https://github.com/whitphx/stlite/commit/e805cae984bb372414bc3938c5109bf6a8aef840) Thanks [@whitphx](https://github.com/whitphx)! - Wait for `parquet-wasm` to finish instantiating before parsing a dataframe.
  
  Stlite parses Arrow payloads through `parquet-wasm`, whose reader throws until its WebAssembly module is instantiated. The initializer was started but never awaited, so an app that rendered a dataframe or an Arrow-backed chart before the 5.5 MB module finished loading took the page down with `Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')`. Bundling the Python runtime into the Cloudflare Worker script made that the common case rather than a rare one, because the app now boots without waiting on a runtime download first.

## 0.3.0

### Minor Changes

- [#2110](https://github.com/whitphx/stlite/pull/2110) [`e56275c`](https://github.com/whitphx/stlite/commit/e56275c7ef594260b944403d9a5f6e2fea275b46) Thanks [@whitphx](https://github.com/whitphx)! - Rebase the Streamlit fork onto 1.62.0, picking up everything upstream shipped across 1.58 through 1.62.
  
  Streamlit removed Base Web (`baseui` and `styletron-*`) from its frontend over those releases, so `@stlite/react` no longer mounts the `StyletronProvider` and `BaseProvider` wrappers. The `BaseProvider` also restated the app's text styles on Base Web's portal host, which stlite needs because it scopes those styles to the `stlite-root` element rather than to `body`; overlays now portal through Streamlit's own `PortalProvider`, so those styles move onto the hosts it marks with `data-st-overlay-root`.
  
  Streamlit's new lazy dataframe delivery stays off under stlite. It slices a `pyarrow.Table` per chunk, and pyarrow has no Pyodide build, so `st.dataframe` keeps rendering through the existing eager Parquet path at every size. Passing `lazy=True` explicitly now raises a `StreamlitAPIException` instead of failing inside the pyarrow stub.
  
  Two other new upstream features start OS threads, which Pyodide refuses. `@st.fragment(parallel=True)` now runs its fragment inline, and `st.skeleton()` used as a context manager schedules its delayed reveal on an asyncio task, matching what `st.spinner` already does.
  
  Shared frontend dependencies in `packages/*` follow upstream: `typescript` ^6.0.3, `vite` ^8.2.1, `vitest` ^4.1.10, `vite-plugin-dts` ^5.0.3, `protobufjs` ^8.7.2. `@stlite/react` keeps its documented `vite` ^7.1.5 pin.

## 0.2.1

### Patch Changes

- [#2097](https://github.com/whitphx/stlite/pull/2097) [`da5e2a6`](https://github.com/whitphx/stlite/commit/da5e2a604c94dcf999e4123a736951dd2e454148) Thanks [@whitphx](https://github.com/whitphx)! - Construct the response `Headers` in the Cloudflare Workers adapter by passing the ASGI header pairs to `js.Headers.new()` directly, dropping the intermediate conversion. No behavior change.

## 0.2.0

### Minor Changes

- [#2077](https://github.com/whitphx/stlite/pull/2077) [`e72edf6`](https://github.com/whitphx/stlite/commit/e72edf6c155b27e4878e413b6c1f731734932b13) Thanks [@whitphx](https://github.com/whitphx)! - Add `@stlite/cloudflare`, a CLI that packages a local Streamlit project into a self-contained, deployable Cloudflare Python Workers directory (`stlite-cloudflare build <path> -o <out>`), running the stlite-patched Streamlit runtime server-side. Deploy the output with Wrangler.
