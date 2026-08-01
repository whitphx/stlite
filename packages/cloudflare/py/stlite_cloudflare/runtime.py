from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

from stlite_cloudflare._asgi import AsgiApp

if TYPE_CHECKING:
    # stlite_lib only becomes importable after ensure_packages() installs the
    # packaged runtime, so the type is import-guarded.
    from stlite_lib.asgi_app import LifespanState
from stlite_cloudflare.media_cache import install_media_cache_mirror
from stlite_cloudflare.package_loader import ensure_packages
from stlite_cloudflare.worker_env import install_worker_secrets

_init_task: asyncio.Task[AsgiApp] | None = None
# Holds the LifespanState whose ``task`` is the suspended coroutine keeping
# Streamlit's runtime context open. asyncio only holds a *weak* reference to a
# task, so without a strong reference here the lifespan task gets
# garbage-collected mid-flight, the runtime tears down, and session WebSockets
# receive BackMsgs with no runtime left to answer them.
_lifespan_state: LifespanState | None = None


async def get_streamlit_asgi_app(env: Any, *, mirror_media: bool = True) -> AsgiApp:
    # Concurrent cold-start requests (index HTML, health check, WebSocket
    # upgrade) must await one shared initialization: the init path suspends at
    # the lifespan startup, and a bare "already initialized?" check would let
    # each request create its own Streamlit Runtime, with the last one
    # silently shadowing the others.
    global _init_task
    task = _init_task
    if task is None:
        task = asyncio.ensure_future(
            _create_streamlit_asgi_app(env, mirror_media=mirror_media)
        )
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


async def _create_streamlit_asgi_app(env: Any, *, mirror_media: bool) -> AsgiApp:
    # The heavy runtime ships as a static asset, not script bytes; it must be
    # installed onto sys.path before the stlite_lib/streamlit imports below.
    await ensure_packages(env)

    try:
        from stlite_lib.asgi_app import start_resident_app
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
    # The app may read st.secrets at first script run; the Worker env's
    # string values (vars + encrypted secrets) must be in place before then.
    install_worker_secrets()
    logging.getLogger("stlite_lib").setLevel(logging.INFO)
    prepare(str(script_path), [])

    # No bind_runtime_to_current_context here: every workerd request goes
    # through call_asgi, which rebinds the runtime contextvar per request, and
    # a bind from this init task would be task-local anyway (PEP 567; see the
    # function's docstring in stlite_lib.asgi_app).
    global _lifespan_state
    _app, call_asgi_app, _lifespan_state = await start_resident_app(
        str(script_path), home_dir=str(home_dir)
    )
    if mirror_media:
        install_media_cache_mirror()
    return call_asgi_app
