"""Run ``create_proxy`` callbacks in the contextvars Context they were made in.

Streamlit keeps the active ``ScriptRunContext`` and the per-run
``FragmentThreadState`` in ``contextvars``. An asyncio task created from the
script inherits them, but a Python callable that JS invokes later, such as a
``pyodide.ffi.create_proxy`` fired from ``setTimeout`` or a promise handler,
is entered directly by Pyodide in whatever Context is current at that
moment, which is the thread's root Context and holds neither. Every ``st.*``
call from such a callback then fails with ``NoSessionContext``
(whitphx/stlite#2113).

``create_proxy`` is the one place a long-lived Python callable is handed to
JS, so this module wraps it: the wrapper snapshots ``copy_context()`` when
the proxy is created and runs each call inside a copy of that snapshot. A
coroutine function's task is created inside the snapshot too, so ``async
def`` callbacks inherit it as well.

Installed at import time from ``stlite_lib/__init__.py``, before any app
code can import ``create_proxy`` by name. Gated on Pyodide so importing
``stlite_lib`` on host CPython leaves ``pyodide.ffi`` alone.
"""

from __future__ import annotations

import asyncio
import contextvars
import functools
import inspect
import sys
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Callable


def wrap_create_proxy(create_proxy: Callable[..., Any]) -> Callable[..., Any]:
    @functools.wraps(create_proxy)
    def create_proxy_in_context(obj: Any, /, **kwargs: Any) -> Any:
        if not callable(obj):
            return create_proxy(obj, **kwargs)

        snapshot = contextvars.copy_context()

        @functools.wraps(obj)
        def run_in_snapshot(*args: Any, **call_kwargs: Any) -> Any:
            # A fresh copy per call: ``Context.run`` refuses to re-enter a
            # Context that is already running, which a callback firing from
            # inside the script would otherwise trip over.
            context = snapshot.copy()
            result = context.run(obj, *args, **call_kwargs)
            if inspect.iscoroutine(result):
                # Pyodide would schedule the coroutine itself, from the root
                # Context. Creating the task here keeps the snapshot.
                return context.run(asyncio.ensure_future, result)
            return result

        return create_proxy(run_in_snapshot, **kwargs)

    return create_proxy_in_context


if sys.platform == "emscripten":
    import pyodide.ffi

    pyodide.ffi.create_proxy = wrap_create_proxy(pyodide.ffi.create_proxy)  # type: ignore[assignment]
    # ``pyodide.ffi.wrappers`` binds ``create_proxy`` by name at import.
    wrappers = sys.modules.get("pyodide.ffi.wrappers")
    if wrappers is not None:
        wrappers.create_proxy = pyodide.ffi.create_proxy  # type: ignore[attr-defined]
