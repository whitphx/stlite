from __future__ import annotations

import asyncio
import sys
import types
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


class _FakeWriter:
    def __init__(self) -> None:
        self.chunks: list[bytes] = []
        self.closed = False

    async def write(self, chunk: bytes) -> None:
        self.chunks.append(chunk)

    async def close(self) -> None:
        self.closed = True


class _FakeTransformStream:
    def __init__(self) -> None:
        self.readable = object()
        self._writer = _FakeWriter()
        self.writable = types.SimpleNamespace(getWriter=lambda: self._writer)


class _FakeResponse:
    def __init__(self, body, status, headers) -> None:
        self.body = body
        self.status = status
        self.headers = headers


@pytest.fixture
def fake_js_env(monkeypatch):
    """Fake the js/pyodide/workers modules run_http_asgi imports at call time."""
    streams: list[_FakeTransformStream] = []

    def make_stream():
        stream = _FakeTransformStream()
        streams.append(stream)
        return stream

    fake_js = types.SimpleNamespace(
        Response=types.SimpleNamespace(
            new=lambda body, status, headers: _FakeResponse(body, status, headers)
        ),
        Headers=types.SimpleNamespace(new=lambda pairs: pairs),
        TransformStream=types.SimpleNamespace(new=make_stream),
    )
    fake_pyodide = types.ModuleType("pyodide")
    fake_ffi = types.ModuleType("pyodide.ffi")
    fake_ffi.to_js = lambda value: value
    fake_ffi.create_proxy = lambda value: types.SimpleNamespace(destroy=lambda: None)
    fake_pyodide.ffi = fake_ffi
    fake_workers = types.ModuleType("workers")
    fake_workers.wait_until = lambda task_proxy: None

    monkeypatch.setitem(sys.modules, "js", fake_js)
    monkeypatch.setitem(sys.modules, "pyodide", fake_pyodide)
    monkeypatch.setitem(sys.modules, "pyodide.ffi", fake_ffi)
    monkeypatch.setitem(sys.modules, "workers", fake_workers)
    return types.SimpleNamespace(streams=streams)


async def _drain() -> None:
    # Let the background app task finish streaming.
    for _ in range(20):
        await asyncio.sleep(0)


async def echo_app(scope, receive, send):
    event = await receive()
    await send(
        {
            "type": "http.response.start",
            "status": 201,
            "headers": [
                (b"content-type", b"text/plain"),
                (b"set-cookie", b"a=1"),
                (b"set-cookie", b"b=2"),
            ],
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


def test_build_http_scope_decodes_path_and_preserves_raw_path():
    request = FakeRequest(
        method="GET",
        url="https://example.com/app/static/my%20image.png?x=1",
        headers={},
    )

    scope = build_http_scope(request)

    assert scope["path"] == "/app/static/my image.png"
    assert scope["raw_path"] == b"/app/static/my%20image.png"


@pytest.mark.asyncio
async def test_run_http_asgi_single_chunk_body(fake_js_env):
    request = FakeRequest(
        method="POST",
        url="https://example.com/dashboard?x=1",
        headers={"content-type": "text/plain"},
        _body=b"hello",
    )

    response = await run_http_asgi(echo_app, request)
    await _drain()

    assert response.status == 201
    assert response.body == b"POST|/dashboard|x=1|hello"
    # Repeated Set-Cookie must survive as separate pairs.
    assert response.headers == [
        ("content-type", "text/plain"),
        ("set-cookie", "a=1"),
        ("set-cookie", "b=2"),
    ]
    assert fake_js_env.streams == []


@pytest.mark.asyncio
async def test_run_http_asgi_streams_multi_chunk_bodies(fake_js_env):
    async def chunked_app(scope, receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b"one", "more_body": True})
        await send({"type": "http.response.body", "body": b"two", "more_body": True})
        await send({"type": "http.response.body", "body": b"three"})

    request = FakeRequest(method="GET", url="https://example.com/", headers={})

    response = await run_http_asgi(chunked_app, request)
    await _drain()

    # The response left with the stream's readable side; the chunks flowed
    # through the writer instead of accumulating into a Python bytes body.
    (stream,) = fake_js_env.streams
    assert response.body is stream.readable
    assert stream._writer.chunks == [b"one", b"two", b"three"]
    assert stream._writer.closed


@pytest.mark.asyncio
async def test_run_http_asgi_null_body_status(fake_js_env):
    async def no_content_app(scope, receive, send):
        await send({"type": "http.response.start", "status": 204, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    request = FakeRequest(method="GET", url="https://example.com/", headers={})

    response = await run_http_asgi(no_content_app, request)
    await _drain()

    assert response.status == 204
    assert response.body is None


@pytest.mark.asyncio
async def test_run_http_asgi_raises_app_errors_before_response(fake_js_env):
    async def broken_app(scope, receive, send):
        raise RuntimeError("boom before start")

    request = FakeRequest(method="GET", url="https://example.com/", headers={})

    with pytest.raises(RuntimeError, match="boom before start"):
        await run_http_asgi(broken_app, request)


@pytest.mark.asyncio
async def test_run_http_asgi_calls_starlette_app(fake_js_env):
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
    await _drain()

    assert response.status == 200
    assert response.body == b"/:payload"
