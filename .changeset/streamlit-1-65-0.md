---
"@stlite/kernel": minor
"@stlite/react": minor
"@stlite/browser": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
"@stlite/cli": minor
"@stlite/cloudflare": minor
---

Rebase the Streamlit fork onto 1.65.0, picking up everything upstream shipped across 1.63 through 1.65.

Streamlit 1.65 gives each session its own asyncio event loop. On Pyodide, creating that loop takes over the worker's running loop, so stlite reuses the worker's loop instead.

Streamlit removed `add_rows()`. Keep the data yourself and redraw the chart into an `st.empty()` placeholder instead; the bundled Hello samples now do this.

Streamlit removed the `mapbox.token` config option. Provide a Mapbox token through the `MAPBOX_API_KEY` environment variable or PyDeck's `api_keys` instead.

Shared frontend dependencies in `packages/*` follow upstream: `protobufjs` ^8.8.0, `vite-plugin-dts` ^5.1.1, `oxfmt` ^0.70.0, `oxlint` ^1.85.0. `vite` and `vitest` stay on their current releases until the newer ones clear the Yarn age gate.
