from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from pathlib import Path
from typing import Any

AsgiReceive = Callable[[], Awaitable[dict[str, Any]]]
AsgiSend = Callable[[dict[str, Any]], Awaitable[None]]
AsgiApp = Callable[[dict[str, Any], AsgiReceive, AsgiSend], Awaitable[None]]

_app: Any | None = None
_lifespan_state: dict[str, Any] | None = None
_asgi: AsgiApp | None = None


async def get_streamlit_asgi_app() -> AsgiApp:
    global _app, _lifespan_state, _asgi
    if _asgi is not None:
        return _asgi

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
    script_path = home_dir / "streamlit_app.py"

    initialize_streamlit_runtime(
        {
            "global.developmentMode": False,
            "server.enableCORS": True,
        }
    )
    logging.getLogger("stlite_lib").setLevel(logging.INFO)
    prepare(str(script_path), [])

    _app = create_app(str(script_path))
    _lifespan_state = await run_lifespan_startup(_app)
    bind_runtime_to_current_context(_app)
    _asgi = make_call_asgi(_app, home_dir=str(home_dir))
    return _asgi
