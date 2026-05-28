---
"@stlite/kernel": minor
"@stlite/react": minor
"@stlite/browser": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
---

Rebase Streamlit fork onto 1.57.0.

Internally, the kernel switches from the hand-rolled `stlite_lib.server.Server` HTTP/WS dispatcher to calling upstream Streamlit's Starlette ASGI app directly via a new ASGI bridge (`stlite_lib.asgi_app` on the Python side, `packages/kernel/src/asgi-bridge.ts` on the JS side). User-visible API surface is unchanged.

To make upstream's Starlette routes work in Pyodide's single-threaded WASM environment, `stlite_lib.anyio_patch` replaces `anyio`'s `run_sync_in_worker_thread` with an inline implementation at package import. This keeps Custom Components, app-static file serving, and other anyio-backed I/O working without spawning worker threads.
