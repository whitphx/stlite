---
"@stlite/kernel": minor
"@stlite/browser": minor
"@stlite/react": minor
"@stlite/desktop": minor
"@stlite/sharing": minor
"@stlite/cloudflare": minor
---

Run Streamlit commands from a JS-invoked Python callback without any setup: a callback wrapped with `pyodide.ffi.create_proxy` or `create_once_callable`, sync or `async def`, now draws into the session of the script that created it, and so does any `asyncio` task the script starts.

Until now such a callback worked only after an `add_script_run_ctx` call, spelled differently inside an `async def` callback, because stlite keyed the `ScriptRunContext` off the running task or thread. The Streamlit fork now keeps the `ScriptRunContext` in a `contextvars` variable, so tasks inherit it, and stlite wraps `create_proxy` and `create_once_callable` to run each callback inside the context captured when the proxy was created. An `add_script_run_ctx` call made inside the callback keeps working, but one made at script level no longer reaches a callable that Pyodide converts to a JS function on its own, so wrap such a callable with `create_proxy` instead. Passing a thread other than the current one now raises `TypeError`, since stlite runs Python on a single thread.
