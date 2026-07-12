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


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        try:
            app = await get_streamlit_asgi_app()
        except Exception:
            # The traceback goes to the Worker logs only; the response body is
            # shown to arbitrary visitors and must not expose internals.
            _LOGGER.exception("stlite-cloudflare startup failed")
            return Response(
                "stlite-cloudflare startup failed. See the Worker logs for details.",
                status=500,
                headers={"content-type": "text/plain; charset=utf-8"},
            )

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
