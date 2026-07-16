from __future__ import annotations

import asyncio
import logging
from collections.abc import Awaitable, Callable
from pathlib import Path
from typing import Any

AsgiReceive = Callable[[], Awaitable[dict[str, Any]]]
AsgiSend = Callable[[dict[str, Any]], Awaitable[None]]
AsgiApp = Callable[[dict[str, Any], AsgiReceive, AsgiSend], Awaitable[None]]

_init_task: asyncio.Task[AsgiApp] | None = None
# Holds the ASGI lifespan handshake state, whose ``_lifespan_task`` is the
# suspended coroutine keeping Streamlit's runtime context open. asyncio only
# holds a *weak* reference to a task, so without a strong reference here the
# lifespan task gets garbage-collected mid-flight, the runtime tears down, and
# session WebSockets receive BackMsgs with no runtime left to answer them.
_lifespan_state: dict[str, Any] | None = None


async def get_streamlit_asgi_app() -> AsgiApp:
    # Concurrent cold-start requests (index HTML, health check, WebSocket
    # upgrade) must await one shared initialization: the init path suspends at
    # the lifespan startup, and a bare "already initialized?" check would let
    # each request create its own Streamlit Runtime, with the last one
    # silently shadowing the others.
    global _init_task
    task = _init_task
    if task is None:
        task = asyncio.ensure_future(_create_streamlit_asgi_app())
        _init_task = task
    try:
        return await task
    except BaseException:
        # Drop the failed task so the next request retries; a Worker isolate
        # can serve traffic for a long time, and caching the failure would
        # turn one transient cold-start error into permanent 500s.
        if _init_task is task:
            _init_task = None
        raise


async def _create_streamlit_asgi_app() -> AsgiApp:
    try:
        from stlite_lib.asgi_app import (
            bind_runtime_to_current_context,
            create_app,
            make_call_asgi,
            run_lifespan_startup,
        )
        from stlite_lib.bootstrap import prepare
        from stlite_lib.runtime_init import initialize_streamlit_runtime
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "stlite runtime is not installed. Install the local stlite-lib and "
            "stlite-pinned Streamlit packages before running the Worker."
        ) from exc

    try:
        import _stlite_cloudflare_app as app_pkg
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "Streamlit app is not packaged. Run `stlite-cloudflare build`."
        ) from exc

    home_dir = Path(app_pkg.__file__).resolve().parent
    try:
        from _stlite_cloudflare_app._stlite_entrypoint import ENTRYPOINT
    except ModuleNotFoundError:
        ENTRYPOINT = "streamlit_app.py"
    script_path = home_dir / ENTRYPOINT

    initialize_streamlit_runtime(
        {
            "global.developmentMode": False,
            "server.enableCORS": True,
        }
    )
    logging.getLogger("stlite_lib").setLevel(logging.INFO)
    prepare(str(script_path), [])

    global _lifespan_state
    app = create_app(str(script_path))
    _lifespan_state = await run_lifespan_startup(app)
    bind_runtime_to_current_context(app)
    return make_call_asgi(app, home_dir=str(home_dir))
