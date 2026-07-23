from __future__ import annotations

import asyncio
import inspect
import logging
from collections.abc import Iterable, Mapping
from typing import Any
from urllib.parse import unquote, urlsplit

from stlite_cloudflare._asgi import AsgiApp, AsgiMessage

_LOGGER = logging.getLogger(__name__)

# https://fetch.spec.whatwg.org/#null-body-status
_NULL_BODY_STATUSES = frozenset({101, 103, 204, 205, 304})


async def run_http_asgi(app: AsgiApp, request: Any) -> Any:
    """Drive one HTTP request through the ASGI app and return a JS Response.

    Response bodies stream through a JS TransformStream as the app produces
    chunks, so a large body (e.g. generated media frames) never sits fully
    buffered in the Python heap — that buffering is what pushed the Worker
    over its memory limit under concurrent media requests. The streaming
    shape is patterned after workers-py's asgi.process_request (MIT,
    (c) Cloudflare):
    https://github.com/cloudflare/workers-py/blob/main/packages/runtime-sdk/src/asgi.py
    """
    import js
    from pyodide.ffi import create_proxy
    from workers import wait_until

    body = await _read_request_body(request)
    scope = build_http_scope(request)

    status = 500
    headers: list[tuple[str, str]] = []
    writer: Any = None
    received = False
    result: asyncio.Future[Any] = asyncio.get_running_loop().create_future()

    async def receive() -> AsgiMessage:
        nonlocal received
        if received:
            return {"type": "http.disconnect"}
        received = True
        return {"type": "http.request", "body": body, "more_body": False}

    def _make_response(response_body: Any) -> Any:
        return js.Response.new(
            response_body,
            status=status,
            headers=_to_js_headers(headers),
        )

    async def send(message: AsgiMessage) -> None:
        nonlocal status, headers, writer
        message_type = message["type"]
        if message_type == "http.response.start":
            status = int(message["status"])
            headers = _decode_response_headers(message.get("headers", []))
            return
        if message_type == "http.response.body":
            chunk = to_bytes(message.get("body", b""))
            more_body = message.get("more_body", False)
            if writer is not None:
                if chunk:
                    await writer.write(_to_js_uint8_array(chunk))
                if not more_body:
                    await writer.close()
            elif more_body:
                # First chunk of a multi-chunk body: hand the readable side to
                # the runtime now and keep writing from the app task.
                transform_stream = js.TransformStream.new()
                writer = transform_stream.writable.getWriter()
                result.set_result(_make_response(transform_stream.readable))
                if chunk:
                    await writer.write(_to_js_uint8_array(chunk))
            elif status in _NULL_BODY_STATUSES:
                result.set_result(_make_response(None))
            else:
                result.set_result(
                    _make_response(_to_js_uint8_array(chunk) if chunk else None)
                )
            return
        raise RuntimeError(f"Unsupported ASGI HTTP message: {message_type}")

    async def run_app() -> None:
        try:
            await app(scope, receive, send)
            if not result.done():
                raise RuntimeError("The ASGI app did not produce a response")
        except Exception as exc:
            if not result.done():
                result.set_exception(exc)
            else:
                # The response already left; the traceback belongs in the
                # Worker logs.
                _LOGGER.exception("ASGI app failed after the response started")
            if writer is not None:
                await writer.close()

    task = asyncio.create_task(run_app())
    task_proxy = create_proxy(task)

    def on_task_done(_task: asyncio.Task[None]) -> None:
        task_proxy.destroy()

    task.add_done_callback(on_task_done)
    # Keep the Worker alive while the app task streams past the return below.
    wait_until(task_proxy)
    return await result


def build_http_scope(request: Any) -> dict[str, Any]:
    url = urlsplit(str(getattr(request, "url")))
    headers = encode_request_headers(getattr(request, "headers", {}))
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
        "root_path": "",
        "headers": headers,
        "client": None,
        "server": (url.hostname or "", server_port),
    }


async def _read_request_body(request: Any) -> bytes:
    body_method = getattr(request, "arrayBuffer", None)
    if callable(body_method):
        return to_bytes(await _maybe_await(body_method()))

    body_method = getattr(request, "body", None)
    if callable(body_method):
        return to_bytes(await _maybe_await(body_method()))

    body = getattr(request, "_body", b"")
    return to_bytes(await _maybe_await(body))


async def _maybe_await(value: Any) -> Any:
    if inspect.isawaitable(value):
        return await value
    return value


def encode_request_headers(headers: Any) -> list[tuple[bytes, bytes]]:
    encoded_headers = []
    for name, value in iter_header_pairs(headers):
        encoded_name = to_bytes(name).lower()
        # Cloudflare's HTTP layer owns response compression. If Streamlit's ASGI
        # gzip middleware also compresses, Wrangler can serve double-gzipped app
        # HTML/media bodies that browsers decode only once.
        if encoded_name == b"accept-encoding":
            continue
        encoded_headers.append((encoded_name, to_bytes(value)))

    return encoded_headers


def _decode_response_headers(
    headers: Iterable[tuple[bytes, bytes]],
) -> list[tuple[str, str]]:
    return [
        (to_bytes(name).decode("latin-1"), to_bytes(value).decode("latin-1"))
        for name, value in headers
    ]


def _to_js_headers(headers: list[tuple[str, str]]) -> Any:
    # Headers.new(sequence-of-pairs) keeps repeated names (multiple
    # Set-Cookie); a plain-object conversion would collapse them.
    import js
    from pyodide.ffi import to_js

    return js.Headers.new(to_js(headers))


def iter_header_pairs(headers: Any) -> Iterable[tuple[Any, Any]]:
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


def to_bytes(value: Any) -> bytes:
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
    if isinstance(value, int):
        # bytes(int) means "n NUL bytes", never the right reading here.
        return str(value).encode()

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


def _to_js_uint8_array(data: bytes | bytearray | memoryview) -> Any:
    # to_js copies a buffer-protocol object into a Uint8Array in one memcpy;
    # this runs for every outbound binary chunk (BackMsg protobufs, media
    # chunks).
    from pyodide.ffi import to_js

    return to_js(bytes(data))
