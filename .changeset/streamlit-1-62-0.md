---
"@stlite/kernel": minor
"@stlite/react": minor
"@stlite/browser": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
"@stlite/cli": minor
"@stlite/cloudflare": minor
---

Rebase the Streamlit fork onto 1.62.0, picking up everything upstream shipped across 1.58 through 1.62.

Streamlit removed Base Web (`baseui` and `styletron-*`) from its frontend over those releases, so `@stlite/react` no longer mounts the `StyletronProvider` and `BaseProvider` wrappers. The `BaseProvider` also restated the app's text styles on Base Web's portal host, which stlite needs because it scopes those styles to the `stlite-root` element rather than to `body`; overlays now portal through Streamlit's own `PortalProvider`, so those styles move onto the hosts it marks with `data-st-overlay-root`.

Shared frontend dependencies in `packages/*` follow upstream: `typescript` ^6.0.3, `vite` ^8.2.1, `vitest` ^4.1.10, `vite-plugin-dts` ^5.0.3, `protobufjs` ^8.7.2. `@stlite/react` keeps its documented `vite` ^7.1.5 pin.
