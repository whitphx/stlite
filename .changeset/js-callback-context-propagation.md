---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/react": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
"@stlite/cloudflare": patch
---

Run Streamlit commands from JS-invoked Python callbacks without any setup: a `pyodide.ffi.create_proxy` callback, sync or `async def`, now draws into the session of the script that created it, and so does any `asyncio` task the script starts.

The Streamlit fork keeps the `ScriptRunContext` in a `contextvars` variable, so tasks inherit it, and stlite wraps `create_proxy` to run each callback inside the context captured when the proxy was created. The worker-thread recipe from the Streamlit docs, `add_script_run_ctx(threading.current_thread(), ctx)`, still works but is no longer needed.
