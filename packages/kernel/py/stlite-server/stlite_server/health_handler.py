from typing import Dict, Tuple

from .handler import Request, RequestHandler


# Mimic streamlit.web.server.routes:HealthHandler
class HealthHandler(RequestHandler):
    def __init__(self, callback):
        self._callback = callback

    async def get(self, request: Request, *args) -> Tuple[int, Dict[str, str], bytes]:
        ok, msg = await self._callback()
        if ok:
            # NOTE: XSRF protection is skipped in this implementation for simplicity.
            return 200, {}, msg

        else:
            # 503 = SERVICE_UNAVAILABLE
            return 503, {}, msg
