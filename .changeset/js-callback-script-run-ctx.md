---
"@stlite/kernel": patch
"@stlite/browser": patch
"@stlite/react": patch
"@stlite/desktop": patch
"@stlite/sharing": patch
"@stlite/cloudflare": patch
---

Let Streamlit commands run from a Python callback that JS invokes outside any asyncio task, such as a `pyodide.ffi.create_proxy` callback fired by `setTimeout` or a JS library's progress callback.

Stlite keys the `ScriptRunContext` off the running asyncio task, and such a callback has none, so every `st.*` call from it failed with `AttributeError: 'NoneType' object has no attribute 'get_name'`. The context now falls back to the thread object when no task is running, so the recipe Streamlit documents for worker threads, `add_script_run_ctx(threading.current_thread(), ctx)`, works from such a callback too, whether the callback attaches the context itself or the script attached it beforehand. An `async def` callback runs as its own task and has to call `add_script_run_ctx(ctx=ctx)` inside itself.
