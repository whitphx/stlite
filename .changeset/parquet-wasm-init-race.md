---
"@stlite/react": patch
"@stlite/browser": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
"@stlite/cloudflare": patch
---

Wait for `parquet-wasm` to finish instantiating before parsing a dataframe.

Stlite parses Arrow payloads through `parquet-wasm`, whose reader throws until its WebAssembly module is instantiated. The initializer was started but never awaited, so an app that rendered a dataframe or an Arrow-backed chart before the 5.5 MB module finished loading took the page down with `Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')`. Bundling the Python runtime into the Cloudflare Worker script made that the common case rather than a rare one, because the app now boots without waiting on a runtime download first.
