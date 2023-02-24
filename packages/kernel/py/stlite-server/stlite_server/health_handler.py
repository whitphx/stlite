from typing import Awaitable, Callable

from .handler import Request, RequestHandler, Response


# Mimic streamlit.web.server.routes.HealthHandler
class HealthHandler(RequestHandler):
    def __init__(self, callback):
        self._callback: Callable[[], Awaitable[tuple[bool, str]]] = callback

    async def get(self, request: Request, *args) -> Response:
        ok, msg = await self._callback()
        if ok:
            # NOTE: XSRF protection is skipped in this implementation for simplicity.
            return Response(status_code=200, headers={}, body=msg)

        else:
            # 503 = SERVICE_UNAVAILABLE
            return Response(status_code=503, headers={}, body=msg)
