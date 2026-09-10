# @stlite/cloudflare

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
