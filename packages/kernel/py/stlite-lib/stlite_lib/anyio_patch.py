"""Make anyio's thread-offload primitive run inline on Pyodide.

Pyodide runs Python in single-threaded WASM, so ``threading.Thread.start()``
raises ``RuntimeError: can't start new thread``. anyio's
``to_thread.run_sync`` and everything funneled through it — ``open_file``,
``AsyncFile.read``/``write``/``close``, ``AsyncPath`` stat/exists/etc.,
starlette's ``FileResponse`` send loop, multipart form parsing — default
to spawning worker threads via the asyncio backend's
``run_sync_in_worker_thread``, which lands on ``Thread.start()`` and
crashes any request that touches those code paths (e.g. serving Custom
Component assets through Streamlit's Starlette routes).

Since the Pyodide worker has no second thread to schedule onto, running
the call inline on the event loop thread is semantically equivalent here:
the loop is the only thread that exists. We replace
``AsyncIOBackend.run_sync_in_worker_thread`` — the single funnel that
both ``anyio.to_thread.run_sync`` and anyio's file/path async wrappers
route through on the asyncio backend (the only one Pyodide can run) —
with a function that just invokes ``func(*args)`` and awaits the result.

The same workaround is used in Gradio-Lite for the same reason.

This module installs the patch at import time and is imported from
``stlite_lib/__init__.py``, so the replacement is in place before any
ASGI app is constructed and before any anyio offload would be attempted.

The patch is gated on ``sys.platform == "emscripten"`` so that importing
``stlite_lib`` on host CPython (e.g. from the stlite_lib pytest suite,
or any future host-side tool) does not silently turn anyio's offloads
into event-loop-blocking inline calls.
"""

from __future__ import annotations

import sys
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Callable

    from anyio import CapacityLimiter


async def _run_sync_inline(
    func: Callable[..., Any],
    args: tuple[Any, ...],
    abandon_on_cancel: bool = False,  # noqa: ARG001 - signature parity with anyio
    limiter: CapacityLimiter | None = None,  # noqa: ARG001 - signature parity with anyio
) -> Any:
    return func(*args)


if sys.platform == "emscripten":
    from anyio._backends._asyncio import AsyncIOBackend

    AsyncIOBackend.run_sync_in_worker_thread = staticmethod(_run_sync_inline)  # type: ignore[assignment]
