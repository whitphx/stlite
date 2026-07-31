"""ASGI WebSocket bridge for Cloudflare Workers.

Kept convergent with workers-py's `asgi.process_websocket`, where several of
this file's fixes have been upstreamed; improvements that emerge in upstream
review are ported back here:
https://github.com/cloudflare/workers-py/blob/main/packages/runtime-sdk/src/asgi.py
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from typing import Any
from urllib.parse import unquote, urlsplit

from stlite_cloudflare._asgi import AsgiApp, AsgiMessage
from stlite_cloudflare.adapter import (
    _to_js_uint8_array,
    encode_request_headers,
    iter_header_pairs,
    to_bytes,
)

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class WebSocketScopeParts:
    path: str
    raw_path: bytes | None = None
    query_string: bytes = b""
    headers: list[tuple[bytes, bytes]] | None = None
    subprotocols: list[str] | None = None


@dataclass(frozen=True)
class WebSocketHandshake:
    accepted: bool
    code: int = 1000
    reason: str = ""
    subprotocol: str | None = None


class AsgiWebSocketSession:
    def __init__(self, app: AsgiApp, socket: Any, scope: dict[str, Any]) -> None:
        self._app = app
        self._socket = socket
        self._scope = scope
        self._incoming: asyncio.Queue[AsgiMessage] = asyncio.Queue()
        self._task: asyncio.Task[None] | None = None
        self._accepted = False
        self._app_closed = False
        self._client_disconnected = False
        self._handshake: asyncio.Future[WebSocketHandshake] | None = None

    def start(self) -> asyncio.Task[None]:
        if self._task is not None:
            raise RuntimeError("WebSocket ASGI session already started")
        self._handshake = asyncio.get_running_loop().create_future()
        self._task = asyncio.create_task(
            self._app(self._scope, self.receive, self.send)
        )
        self._incoming.put_nowait({"type": "websocket.connect"})
        self._task.add_done_callback(self._reject_unfinished_handshake)
        self._task.add_done_callback(self._close_abandoned_socket)
        self._task.add_done_callback(self._log_app_failure)
        return self._task

    async def wait_for_handshake(self) -> WebSocketHandshake:
        if self._handshake is None:
            raise RuntimeError("WebSocket ASGI session has not started")
        return await self._handshake

    async def receive(self) -> AsgiMessage:
        return await self._incoming.get()

    async def send(self, message: AsgiMessage) -> None:
        message_type = message["type"]
        if message_type == "websocket.accept":
            self._accepted = True
            accept = getattr(self._socket, "accept", None)
            if callable(accept):
                accept()
            self._resolve_handshake(
                WebSocketHandshake(
                    accepted=True, subprotocol=message.get("subprotocol")
                )
            )
            return
        if message_type == "websocket.send":
            payload = message.get("bytes")
            if payload is None:
                payload = message.get("text", "")
            elif isinstance(payload, bytes | bytearray | memoryview):
                payload = _to_js_uint8_array(payload)
            self._socket.send(payload)
            return
        if message_type == "websocket.close":
            if not self._accepted:
                self._resolve_handshake(
                    WebSocketHandshake(
                        accepted=False,
                        code=message.get("code", 1000),
                        reason=message.get("reason", ""),
                    )
                )
                return
            self._app_closed = True
            close = getattr(self._socket, "close", None)
            if callable(close):
                close(message.get("code", 1000), message.get("reason", ""))
            return
        raise RuntimeError(f"Unsupported ASGI WebSocket message: {message_type}")

    def receive_text(self, text: str) -> None:
        self._incoming.put_nowait({"type": "websocket.receive", "text": text})

    def receive_bytes(self, data: bytes) -> None:
        self._incoming.put_nowait({"type": "websocket.receive", "bytes": data})

    def disconnect(self, code: int = 1000) -> None:
        self._client_disconnected = True
        self._incoming.put_nowait({"type": "websocket.disconnect", "code": code})

    def _resolve_handshake(self, result: WebSocketHandshake) -> None:
        if self._handshake is not None and not self._handshake.done():
            self._handshake.set_result(result)

    def _reject_unfinished_handshake(self, task: asyncio.Task[None]) -> None:
        if self._handshake is None or self._handshake.done():
            return
        if task.cancelled():
            self._handshake.set_result(WebSocketHandshake(accepted=False, code=1011))
            return
        error = task.exception()
        if error is not None:
            self._handshake.set_exception(error)
        else:
            self._handshake.set_result(WebSocketHandshake(accepted=False, code=1011))

    def _close_abandoned_socket(self, task: asyncio.Task[None]) -> None:
        # The ASGI spec requires the server to close the transport when the
        # app task ends after accept without sending "websocket.close" (1011
        # on error); otherwise the browser keeps a half-open connection and
        # the Streamlit frontend hangs instead of reconnecting.
        if not self._accepted or self._app_closed or self._client_disconnected:
            return
        failed = not task.cancelled() and task.exception() is not None
        close = getattr(self._socket, "close", None)
        if callable(close):
            try:
                close(1011 if failed else 1000, "")
            except Exception:
                # The peer may already have closed the socket.
                pass

    def _log_app_failure(self, task: asyncio.Task[None]) -> None:
        # Calling task.exception() also marks the failure retrieved, so a
        # crash the runner never awaits (it only awaits the handshake) doesn't
        # surface as asyncio's "Task exception was never retrieved".
        if task.cancelled():
            return
        error = task.exception()
        if error is None:
            return
        handshake = self._handshake
        if (
            handshake is not None
            and handshake.done()
            and not handshake.cancelled()
            and handshake.exception() is error
        ):
            # The runner awaits the handshake and reports this failure itself.
            return
        _LOGGER.error("WebSocket ASGI app failed after the handshake", exc_info=error)


def build_websocket_scope(parts: WebSocketScopeParts) -> dict[str, Any]:
    return {
        "type": "websocket",
        "asgi": {"version": "3.0", "spec_version": "2.5"},
        "http_version": "1.1",
        "scheme": "wss",
        "path": parts.path,
        "raw_path": (
            parts.raw_path if parts.raw_path is not None else parts.path.encode()
        ),
        "query_string": parts.query_string,
        "root_path": "",
        "headers": parts.headers or [],
        "client": None,
        "server": None,
        "subprotocols": parts.subprotocols or [],
    }


def is_websocket_upgrade(request: Any) -> bool:
    return _header_value(request, "upgrade").lower() == "websocket"


def build_websocket_scope_from_request(request: Any) -> dict[str, Any]:
    url = urlsplit(str(getattr(request, "url")))
    headers = encode_request_headers(getattr(request, "headers", {}))
    scheme = "wss" if (url.scheme or "https") == "https" else "ws"
    return build_websocket_scope(
        WebSocketScopeParts(
            path=unquote(url.path or "/"),
            raw_path=(url.path or "/").encode(),
            query_string=url.query.encode(),
            headers=headers,
            subprotocols=_subprotocols_from_headers(request),
        )
    ) | {
        "scheme": scheme,
        "server": (
            url.hostname or "",
            url.port or (443 if scheme == "wss" else 80),
        ),
    }


async def run_cloudflare_websocket_asgi(app: AsgiApp, request: Any) -> Any:
    import js
    from pyodide.ffi import create_proxy
    from workers import Response, wait_until

    pair = js.WebSocketPair.new()
    endpoints = js.Object.values(pair)
    client = endpoints.at(0)
    server = endpoints.at(1)
    # Binary frames otherwise arrive as Blob (observed under wrangler dev),
    # which cannot be read synchronously in the message callback.
    server.binaryType = "arraybuffer"
    scope = build_websocket_scope_from_request(request)
    session = AsgiWebSocketSession(app, server, scope)
    proxies: list[Any] = []
    event_listeners: list[tuple[str, Any]] = []

    def destroy_proxy(proxy: Any) -> None:
        destroy = getattr(proxy, "destroy", None)
        if callable(destroy):
            destroy()

    def cleanup_proxies() -> None:
        while event_listeners:
            event_type, proxy = event_listeners.pop()
            server.removeEventListener(event_type, proxy)
        while proxies:
            destroy_proxy(proxies.pop())

    def on_message(event: Any) -> None:
        data = event.data
        if isinstance(data, str):
            session.receive_text(data)
        else:
            session.receive_bytes(to_bytes(data))

    def on_close(event: Any) -> None:
        session.disconnect(int(getattr(event, "code", 1000) or 1000))

    def on_error(_event: Any) -> None:
        session.disconnect(1011)

    for event_type, callback in [
        ("message", on_message),
        ("close", on_close),
        ("error", on_error),
    ]:
        proxy = create_proxy(callback)
        proxies.append(proxy)
        event_listeners.append((event_type, proxy))
        server.addEventListener(event_type, proxy)

    task = session.start()
    task_proxy = create_proxy(task)

    def on_task_done(_task: asyncio.Task[None]) -> None:
        cleanup_proxies()
        destroy_proxy(task_proxy)

    task.add_done_callback(on_task_done)
    wait_until(task_proxy)
    try:
        handshake = await session.wait_for_handshake()
    except Exception:
        # The app crashed before accepting or rejecting the connection; the
        # traceback belongs in the Worker logs, and the client gets a clean
        # HTTP error instead of an unhandled exception page.
        _LOGGER.exception("WebSocket ASGI app failed during the handshake")
        cleanup_proxies()
        return Response(None, status=500)
    if not handshake.accepted:
        cleanup_proxies()
        return Response(None, status=403)
    headers = (
        {"sec-websocket-protocol": handshake.subprotocol}
        if handshake.subprotocol is not None
        else None
    )
    return Response(None, status=101, headers=headers, web_socket=client)


def _header_value(request: Any, name: str) -> str:
    wanted = name.lower()
    for key, value in iter_header_pairs(getattr(request, "headers", {})):
        if str(key).lower() == wanted:
            return str(value)
    return ""


def _subprotocols_from_headers(request: Any) -> list[str]:
    value = _header_value(request, "sec-websocket-protocol")
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]
