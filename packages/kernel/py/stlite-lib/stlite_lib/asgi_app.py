"""ASGI bridge between the JS worker and Streamlit's Starlette app.

This is the stlite-side counterpart to packages/kernel/src/asgi-bridge.ts.
Instead of emulating Streamlit's HTTP/WebSocket server (the legacy approach in
stlite_lib.server.Server), we instantiate Streamlit's upstream Starlette ASGI
application and let JS drive it through the ASGI protocol:
https://asgi.readthedocs.io/en/latest/specs/main.html

The JS side wraps each request as an ASGI ``scope`` and supplies async
``receive`` / ``send`` callables (proxied via pyodide.ffi). All HTTP routes,
WebSocket negotiation, session middleware, etc. live in upstream Streamlit.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import MutableMapping

    from streamlit.web.server.starlette.starlette_app import App

    AsgiMessage = MutableMapping[str, Any]


def create_app(script_path: str) -> App:
    """Build a Streamlit ASGI app for ``script_path``.

    The returned object is callable as ``await app(scope, receive, send)``.
    """
    # Imported lazily so a stlite worker that never reaches the ASGI path
    # (e.g. an early boot failure) doesn't pay the import cost.
    from streamlit.web.server.starlette.starlette_app import App

    return App(script_path)


async def run_lifespan_startup(app: App) -> dict[str, Any]:
    """Drive the ASGI lifespan startup handshake against ``app``.

    Returns the state dict yielded by the lifespan context manager (Starlette
    converts ``lifespan.startup.complete`` / ``.shutdown.complete`` events into
    ``app.state``). The caller is responsible for invoking
    :func:`run_lifespan_shutdown` when the app is torn down.

    Note that :func:`call_asgi` rebinds ``runtime_contextvar`` for every
    http/websocket call; we don't bother setting it here because the lifespan
    task only ever talks to ``app._runtime`` directly.
    """
    import asyncio

    received_startup = asyncio.Event()
    startup_done = asyncio.Event()
    shutdown_requested = asyncio.Event()

    async def receive() -> AsgiMessage:
        if not received_startup.is_set():
            received_startup.set()
            return {"type": "lifespan.startup"}
        await shutdown_requested.wait()
        return {"type": "lifespan.shutdown"}

    state: dict[str, Any] = {}

    async def send(event: AsgiMessage) -> None:
        msg_type = event.get("type")
        if msg_type == "lifespan.startup.complete":
            startup_done.set()
        elif msg_type == "lifespan.startup.failed":
            startup_done.set()
            raise RuntimeError(
                f"Streamlit ASGI lifespan startup failed: {event.get('message')}"
            )
        elif msg_type == "lifespan.shutdown.complete":
            pass

    # Run the lifespan coroutine on its own task so the JS side can later
    # signal shutdown via the returned ``shutdown_requested`` event.
    scope = {"type": "lifespan", "asgi": {"version": "3.0", "spec_version": "2.0"}}
    lifespan_task = asyncio.create_task(app(scope, receive, send))

    # Wait for either startup.complete or the lifespan task to crash early.
    done, _pending = await asyncio.wait(
        {asyncio.create_task(startup_done.wait()), lifespan_task},
        return_when=asyncio.FIRST_COMPLETED,
    )
    if lifespan_task in done and not startup_done.is_set():
        # Surface the exception from the lifespan task.
        await lifespan_task

    state["_shutdown_event"] = shutdown_requested
    state["_lifespan_task"] = lifespan_task
    return state


async def run_lifespan_shutdown(lifespan_state: dict[str, Any]) -> None:
    """Signal ``lifespan.shutdown`` and wait for the lifespan task to finish."""
    shutdown_event = lifespan_state.get("_shutdown_event")
    lifespan_task = lifespan_state.get("_lifespan_task")
    if shutdown_event is None or lifespan_task is None:
        return
    shutdown_event.set()
    await lifespan_task


def _bytesify(value: Any) -> Any:
    """Recursively convert ``memoryview`` to ``bytes`` in nested structures.

    Pyodide maps JS ``Uint8Array`` to Python ``memoryview`` by default, but
    Starlette (and the ASGI spec) require header names/values and body chunks
    to be ``bytes`` — ``memoryview.decode(...)`` doesn't exist.
    """
    if isinstance(value, memoryview):
        return value.tobytes()
    if isinstance(value, dict):
        return {k: _bytesify(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_bytesify(v) for v in value]
    if isinstance(value, tuple):
        return tuple(_bytesify(v) for v in value)
    return value


def _to_py(value: Any) -> Any:
    """Convert a Pyodide JsProxy to a Python object, if needed.

    Plain JS objects come into Python as JsProxy. ASGI handlers read them
    with subscript (``scope["type"]``), which a JsProxy doesn't support
    unless it wraps a Map/Array. ``.to_py()`` recursively converts the
    object tree. The check is duck-typed so Python objects (already dicts,
    lists, bytes) pass through unchanged. We additionally normalize
    ``memoryview`` → ``bytes`` so ASGI-spec consumers get what they expect.
    """
    to_py = getattr(value, "to_py", None)
    if callable(to_py):
        return _bytesify(to_py())
    return value


async def call_asgi(
    app: App,
    scope: Any,
    receive: Any,
    send: Any,
) -> None:
    """Call an ASGI app with scope/receive/send originating from JS.

    Converts JS plain objects to Python dicts at the boundary so the app
    can use the standard ASGI accessors. ``send`` is passed through —
    the JS-side ``send`` handler already accepts JsProxy events.

    Each call also binds ``streamlit.runtime.runtime_contextvar`` to the
    App's runtime instance. The Streamlit script runner and several
    runtime helpers fetch it via ``Runtime.get_instance()``; without
    this binding the script execution task spawned during request
    handling raises ``Exception: Runtime instance not created yet``.
    Setting it here (not in run_lifespan_startup) is intentional: each
    JS→Python ASGI call lands in a fresh Pyodide asyncio task whose
    context doesn't inherit the value bound in the lifespan task, so
    we need to re-bind on every entry. The PEP 567 contextvar set then
    propagates to any task the request handler spawns (e.g. the script
    runner coroutine).
    """
    from streamlit.runtime import runtime_contextvar

    runtime = getattr(app, "_runtime", None)
    if runtime is not None:
        runtime_contextvar.set(runtime)

    py_scope = _to_py(scope)

    async def py_receive() -> AsgiMessage:
        js_event = await receive()
        return _to_py(js_event)

    await app(py_scope, py_receive, send)


__all__ = [
    "call_asgi",
    "create_app",
    "run_lifespan_shutdown",
    "run_lifespan_startup",
]
