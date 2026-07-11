from __future__ import annotations

import inspect
from collections.abc import Awaitable, Callable, Iterable, Mapping
from dataclasses import dataclass
from typing import Any
from urllib.parse import unquote, urlsplit

AsgiMessage = dict[str, Any]
AsgiReceive = Callable[[], Awaitable[AsgiMessage]]
AsgiSend = Callable[[AsgiMessage], Awaitable[None]]
AsgiApp = Callable[[dict[str, Any], AsgiReceive, AsgiSend], Awaitable[None]]


@dataclass(frozen=True)
class AsgiHttpResponse:
    status: int
    headers: list[tuple[str, str]]
    body: bytes


async def run_http_asgi(app: AsgiApp, request: Any) -> AsgiHttpResponse:
    body = await _read_request_body(request)
    scope = build_http_scope(request)
    received = False
    status = 500
    headers: list[tuple[str, str]] = []
    chunks: list[bytes] = []

    async def receive() -> AsgiMessage:
        nonlocal received
        if received:
            return {"type": "http.disconnect"}
        received = True
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message: AsgiMessage) -> None:
        nonlocal status, headers
        message_type = message["type"]
        if message_type == "http.response.start":
            status = int(message["status"])
            headers = _decode_response_headers(message.get("headers", []))
            return
        if message_type == "http.response.body":
            chunks.append(_to_bytes(message.get("body", b"")))
            return
        raise RuntimeError(f"Unsupported ASGI HTTP message: {message_type}")

    await app(scope, receive, send)
    return AsgiHttpResponse(status=status, headers=headers, body=b"".join(chunks))


def build_http_scope(request: Any) -> dict[str, Any]:
    url = urlsplit(str(getattr(request, "url")))
    headers = _encode_request_headers(getattr(request, "headers", {}))
    method = str(getattr(request, "method", "GET")).upper()
    server_port = url.port
    if server_port is None:
        server_port = 443 if url.scheme == "https" else 80

    return {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.5"},
        "http_version": "1.1",
        "method": method,
        "scheme": url.scheme or "https",
        "path": unquote(url.path or "/"),
        "raw_path": (url.path or "/").encode(),
        "query_string": url.query.encode(),
        "headers": headers,
        "client": None,
        "server": (url.hostname or "", server_port),
    }


async def _read_request_body(request: Any) -> bytes:
    body_method = getattr(request, "arrayBuffer", None)
    if callable(body_method):
        return _to_bytes(await _maybe_await(body_method()))

    body_method = getattr(request, "body", None)
    if callable(body_method):
        return _to_bytes(await _maybe_await(body_method()))

    body = getattr(request, "_body", b"")
    return _to_bytes(await _maybe_await(body))


async def _maybe_await(value: Any) -> Any:
    if inspect.isawaitable(value):
        return await value
    return value


def _encode_request_headers(headers: Any) -> list[tuple[bytes, bytes]]:
    encoded_headers = []
    for name, value in _iter_header_pairs(headers):
        encoded_name = _to_bytes(name).lower()
        # Cloudflare's HTTP layer owns response compression. If Streamlit's ASGI
        # gzip middleware also compresses, Wrangler can serve double-gzipped app
        # HTML/media bodies that browsers decode only once.
        if encoded_name == b"accept-encoding":
            continue
        encoded_headers.append((encoded_name, _to_bytes(value)))

    return encoded_headers


def _decode_response_headers(
    headers: Iterable[tuple[bytes, bytes]],
) -> list[tuple[str, str]]:
    return [
        (_to_bytes(name).decode("latin-1"), _to_bytes(value).decode("latin-1"))
        for name, value in headers
    ]


def _iter_header_pairs(headers: Any) -> Iterable[tuple[Any, Any]]:
    entries = getattr(headers, "entries", None)
    if callable(entries):
        yield from entries()
        return

    items = getattr(headers, "items", None)
    if callable(items):
        yield from items()
        return

    if isinstance(headers, Mapping):
        yield from headers.items()
        return

    yield from headers


def _to_bytes(value: Any) -> bytes:
    js_bytes = _try_js_bytes(value)
    if js_bytes is not None:
        return js_bytes

    to_py = getattr(value, "to_py", None)
    if callable(to_py):
        value = to_py()

    if value is None:
        return b""
    if isinstance(value, bytes):
        return value
    if isinstance(value, bytearray):
        return bytes(value)
    if isinstance(value, memoryview):
        return value.tobytes()
    if isinstance(value, str):
        return value.encode()

    try:
        return bytes(value)
    except TypeError:
        return str(value).encode()


def _try_js_bytes(value: Any) -> bytes | None:
    constructor = getattr(value, "constructor", None)
    constructor_name = getattr(constructor, "name", "")
    if constructor_name not in {
        "ArrayBuffer",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int8Array",
    }:
        return None

    import js

    if constructor_name == "ArrayBuffer":
        view = js.Uint8Array.new(value)
    else:
        view = js.Uint8Array.new(value.buffer, value.byteOffset, value.byteLength)

    return bytes(view.to_py())
