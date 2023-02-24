## `stlite-server`

Streamlit has 2 separate submodules, `web` and `runtime`.
We use `runtime` only, which contains all necessary core features of Streamlit, but we omit `web` because it relies on `tornado`, which cannot be installed on Pyodide, and even if we hack it to be installable, we don't need its full HTTP-compatible implementation. In contrast, we only need a small subset (or imitation) of HTTP for our original communication layer used in `worker.ts`, and we prioritize a smaller bundle size.

For that purpose, we created this package, `stlite-server`, including `server.Server` class.
It exposes methods for the WebSocket- and HTTP-like connections that are handled in `worker.ts`, and it also implements request handlers similar to the ones defined in the original server implementation, `streamlit.web.server.server.Server`.

See the following links for the details.
* A PR where this package is created.
  * https://github.com/whitphx/stlite/pull/492
* PRs for the upstream Streamlit repo where the `web` and `runtime` sub-packages are decoupled.
  * https://github.com/streamlit/streamlit/pull/4956
  * https://github.com/streamlit/streamlit/pull/5072
  * https://github.com/streamlit/streamlit/pull/5136
