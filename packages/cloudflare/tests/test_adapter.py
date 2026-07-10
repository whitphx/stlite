from __future__ import annotations

from dataclasses import dataclass

import pytest
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.routing import Route

from stlite_cloudflare.adapter import build_http_scope, run_http_asgi


@dataclass
class FakeRequest:
    method: str
    url: str
    headers: dict[str, str]
    _body: bytes = b""

    async def arrayBuffer(self) -> bytes:
        return self._body


async def echo_app(scope, receive, send):
    event = await receive()
    await send(
        {
            "type": "http.response.start",
            "status": 201,
            "headers": [(b"content-type", b"text/plain")],
        }
    )
    body = b"|".join(
        [
            scope["method"].encode(),
            scope["path"].encode(),
            scope["query_string"],
            event["body"],
        ]
    )
    await send({"type": "http.response.body", "body": body})


def test_build_http_scope_normalizes_request_metadata():
    request = FakeRequest(
        method="post",
        url="https://example.com/dashboard?x=1",
        headers={"Content-Type": "text/plain", "Accept-Encoding": "gzip, br"},
    )

    scope = build_http_scope(request)

    assert scope["type"] == "http"
    assert scope["method"] == "POST"
    assert scope["scheme"] == "https"
    assert scope["path"] == "/dashboard"
    assert scope["raw_path"] == b"/dashboard"
    assert scope["query_string"] == b"x=1"
    assert scope["server"] == ("example.com", 443)
    assert scope["headers"] == [(b"content-type", b"text/plain")]


@pytest.mark.asyncio
async def test_run_http_asgi_returns_buffered_response():
    request = FakeRequest(
        method="POST",
        url="https://example.com/dashboard?x=1",
        headers={"content-type": "text/plain"},
        _body=b"hello",
    )

    response = await run_http_asgi(echo_app, request)

    assert response.status == 201
    assert response.headers == [("content-type", "text/plain")]
    assert response.body == b"POST|/dashboard|x=1|hello"


@pytest.mark.asyncio
async def test_run_http_asgi_calls_starlette_app():
    async def homepage(request):
        body = await request.body()
        return PlainTextResponse(f"{request.url.path}:{body.decode()}")

    app = Starlette(routes=[Route("/", homepage, methods=["POST"])])
    request = FakeRequest(
        method="POST",
        url="https://example.com/",
        headers={"host": "example.com"},
        _body=b"payload",
    )

    response = await run_http_asgi(app, request)

    assert response.status == 200
    assert response.body == b"/:payload"
