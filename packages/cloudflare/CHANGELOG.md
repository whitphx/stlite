# @stlite/cloudflare

## 0.2.1

### Patch Changes

- [#2097](https://github.com/whitphx/stlite/pull/2097) [`da5e2a6`](https://github.com/whitphx/stlite/commit/da5e2a604c94dcf999e4123a736951dd2e454148) Thanks [@whitphx](https://github.com/whitphx)! - Construct the response `Headers` in the Cloudflare Workers adapter by passing the ASGI header pairs to `js.Headers.new()` directly, dropping the intermediate conversion. No behavior change.

## 0.2.0

### Minor Changes

- [#2077](https://github.com/whitphx/stlite/pull/2077) [`e72edf6`](https://github.com/whitphx/stlite/commit/e72edf6c155b27e4878e413b6c1f731734932b13) Thanks [@whitphx](https://github.com/whitphx)! - Add `@stlite/cloudflare`, a CLI that packages a local Streamlit project into a self-contained, deployable Cloudflare Python Workers directory (`stlite-cloudflare build <path> -o <out>`), running the stlite-patched Streamlit runtime server-side. Deploy the output with Wrangler.
