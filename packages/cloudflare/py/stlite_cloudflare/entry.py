import logging
from urllib.parse import unquote, urlsplit

from workers import Response, WorkerEntrypoint

from stlite_cloudflare.adapter import run_http_asgi
from stlite_cloudflare.frontend_config import with_cloudflare_frontend_config
from stlite_cloudflare.runtime import get_streamlit_asgi_app
from stlite_cloudflare.websocket import (
    is_websocket_upgrade,
    run_cloudflare_websocket_asgi,
)

_LOGGER = logging.getLogger(__name__)


# The `workers` SDK ships an `asgi.fetch(app, request, env)` helper, but it does
# not fit Streamlit, so we bridge ASGI by hand instead:
#   - It starts a fresh ASGI lifespan on every request (asgi.start_application),
#     whereas Streamlit's runtime must start once and stay resident (see
#     runtime.py's shared init + retained `_lifespan_state`); a new runtime per
#     request loses all session state.
#   - Its WebSocket bridge is text-only, but Streamlit's transport is binary
#     protobuf (ForwardMsg), so we need the binary/handshake/close handling in
#     websocket.py.
#   - It returns the Worker Response directly, leaving nowhere to strip
#     `accept-encoding` (avoids double-gzip) or inject the Cloudflare frontend
#     config into the index HTML (see adapter.py / frontend_config.py).
class Default(WorkerEntrypoint):
    async def fetch(self, request):
        try:
            app = await get_streamlit_asgi_app()
        except Exception:
            _LOGGER.exception("stlite-cloudflare startup failed")
            return _error_500("stlite-cloudflare startup failed.")

        try:
            if is_websocket_upgrade(request):
                return await run_cloudflare_websocket_asgi(app, request)

            response = with_cloudflare_frontend_config(
                await run_http_asgi(app, request),
                path=unquote(urlsplit(str(request.url)).path or "/"),
            )
            return Response(
                response.body,
                status=response.status,
                headers=response.headers,
            )
        except Exception:
            _LOGGER.exception("stlite-cloudflare request handling failed")
            return _error_500("stlite-cloudflare failed to handle the request.")


def _error_500(message: str) -> Response:
    # The traceback goes to the Worker logs only; the body is shown to arbitrary
    # visitors and must not expose internals.
    return Response(
        f"{message} See the Worker logs for details.",
        status=500,
        headers={"content-type": "text/plain; charset=utf-8"},
    )
