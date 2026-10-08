"""Run JS-invoked Python callbacks in the contextvars Context they were made in.

Streamlit keeps the active ``ScriptRunContext`` and the per-run
``FragmentThreadState`` in ``contextvars``. An asyncio task created from the
script inherits them, but a Python callable that JS invokes later, such as a
``pyodide.ffi.create_proxy`` fired from ``setTimeout`` or a promise handler,
is entered directly by Pyodide in whatever Context is current at that
moment, which is the thread's root Context and holds neither. Every ``st.*``
call from such a callback then fails with ``NoSessionContext``
(whitphx/stlite#2113).

``create_proxy`` and ``create_once_callable`` are where a Python callable is
handed to JS to be called later (``pyodide.ffi.wrappers`` builds
``add_event_listener``, ``set_timeout`` and ``set_interval`` on them), so
this module wraps both: the wrapper snapshots ``copy_context()`` when the
proxy is created and runs each call inside a copy of that snapshot. A
coroutine function's task is created inside the snapshot too, so ``async
def`` callbacks inherit it as well. A bare Python callable passed to a JS
API without either helper is converted in Pyodide's C layer and is not
covered.

``install()`` has to run before any app code imports the helpers by name,
since ``from pyodide.ffi import create_proxy`` binds the unwrapped function.
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


class _CallInSnapshot:
    """Call ``callable_`` inside a copy of ``snapshot``.

    Attribute access falls through to ``callable_`` so a callable object handed
    to JS keeps exposing its own attributes and methods through the proxy.
    """

    _FIELDS = ("_callable", "_snapshot")

    def __init__(
        self, callable_: Callable[..., Any], snapshot: contextvars.Context
    ) -> None:
        self._callable = callable_
        self._snapshot = snapshot

    def __call__(self, *args: Any, **kwargs: Any) -> Any:
        # A fresh copy per call: ``Context.run`` refuses to re-enter a Context
        # that is already running, which a callback firing from inside the
        # script, or from inside another callback, would otherwise trip over.
        call_context = self._snapshot.copy()
        result = call_context.run(self._callable, *args, **kwargs)
        if inspect.iscoroutine(result):
            # Pyodide would schedule the coroutine itself, from the root
            # Context. Creating the task here keeps the snapshot.
            return call_context.run(asyncio.ensure_future, result)
        return result

    def __getattr__(self, name: str) -> Any:
        # ``copy.copy`` probes a not-yet-initialized instance for
        # ``__setstate__``, where reading ``self._callable`` would land back
        # here and recurse.
        if name in self._FIELDS:
            raise AttributeError(name)
        attribute = getattr(self._callable, name)
        # JS can call a method straight off the proxy (``proxy.method()``),
        # which never goes through ``__call__``. Only bound methods are wrapped:
        # a class stored as an attribute must stay usable with ``isinstance``.
        if inspect.ismethod(attribute):
            return _CallInSnapshot(attribute, self._snapshot)
        return attribute

    # Writes from JS land on this wrapper, so pass them on to the callable
    # object, whose own code reads them.
    def __setattr__(self, name: str, value: Any) -> None:
        if name in self._FIELDS:
            object.__setattr__(self, name, value)
        else:
            setattr(self._callable, name, value)

    def __delattr__(self, name: str) -> None:
        if name in self._FIELDS:
            object.__delattr__(self, name)
        else:
            delattr(self._callable, name)


def wrap_proxy_factory(factory: Callable[..., Any]) -> Callable[..., Any]:
    @functools.wraps(factory)
    def factory_in_context(obj: Any, /, **kwargs: Any) -> Any:
        if not callable(obj):
            return factory(obj, **kwargs)
        return factory(_CallInSnapshot(obj, contextvars.copy_context()), **kwargs)

    return factory_in_context


_installed = False


def install() -> None:
    global _installed
    # Every runtime init calls this: each app sharing a SharedWorker's Pyodide,
    # and a retried Cloudflare init. Wrapping twice would nest snapshots.
    if _installed:
        return

    import pyodide.ffi

    pyodide.ffi.create_proxy = wrap_proxy_factory(pyodide.ffi.create_proxy)  # type: ignore[assignment]
    pyodide.ffi.create_once_callable = wrap_proxy_factory(  # type: ignore[assignment]
        pyodide.ffi.create_once_callable
    )
    # ``pyodide.ffi.wrappers`` binds both helpers by name at import.
    wrappers = sys.modules.get("pyodide.ffi.wrappers")
    if wrappers is not None:
        wrappers.create_proxy = pyodide.ffi.create_proxy  # type: ignore[attr-defined]
        wrappers.create_once_callable = pyodide.ffi.create_once_callable  # type: ignore[attr-defined]
    _installed = True
