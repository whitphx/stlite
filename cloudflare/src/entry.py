from workers import Response, WorkerEntrypoint

from stlite_cloudflare.adapter import run_http_asgi
from stlite_cloudflare.runtime import get_streamlit_asgi_app
from stlite_cloudflare.websocket import (
    is_websocket_upgrade,
    run_cloudflare_websocket_asgi,
)


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        try:
            app = await get_streamlit_asgi_app()
        except Exception as exc:
            return Response(
                f"stlite-cloudflare startup failed: {exc}",
                status=500,
                headers={"content-type": "text/plain; charset=utf-8"},
            )

        if is_websocket_upgrade(request):
            return await run_cloudflare_websocket_asgi(app, request)

        response = await run_http_asgi(app, request)
        return Response(
            response.body,
            status=response.status,
            headers=response.headers,
        )
