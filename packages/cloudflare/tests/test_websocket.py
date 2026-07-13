from __future__ import annotations

import pytest

from stlite_cloudflare.websocket import (
    AsgiWebSocketSession,
    WebSocketScopeParts,
    build_websocket_scope,
    build_websocket_scope_from_request,
    is_websocket_upgrade,
)


class FakeSocket:
    def __init__(self):
        self.accepted = False
        self.sent = []
        self.closed = None

    def accept(self):
        self.accepted = True

    def send(self, payload):
        self.sent.append(payload)

    def close(self, code=1000, reason=""):
        self.closed = (code, reason)


class FakeRequest:
    def __init__(self, url, headers):
        self.url = url
        self.headers = headers


async def echo_websocket_app(scope, receive, send):
    assert scope["type"] == "websocket"
    assert (await receive())["type"] == "websocket.connect"
    await send({"type": "websocket.accept"})

    event = await receive()
    await send({"type": "websocket.send", "text": event["text"].upper()})

    event = await receive()
    assert event["type"] == "websocket.disconnect"
    await send({"type": "websocket.close", "code": event["code"]})


async def reject_websocket_app(scope, receive, send):
    assert scope["type"] == "websocket"
    assert (await receive())["type"] == "websocket.connect"
    await send({"type": "websocket.close", "code": 1008, "reason": "nope"})


def test_build_websocket_scope():
    scope = build_websocket_scope(
        WebSocketScopeParts(
            path="/_stcore/stream",
            query_string=b"session=1",
            headers=[(b"host", b"example.com")],
            subprotocols=["streamlit"],
        )
    )

    assert scope["type"] == "websocket"
    assert scope["path"] == "/_stcore/stream"
    assert scope["query_string"] == b"session=1"
    assert scope["headers"] == [(b"host", b"example.com")]
    assert scope["subprotocols"] == ["streamlit"]


def test_build_websocket_scope_from_request():
    request = FakeRequest(
        "https://example.com/_stcore/stream?session=1",
        {
            "Host": "example.com",
            "Upgrade": "websocket",
            "Sec-WebSocket-Protocol": "chat, streamlit",
        },
    )

    scope = build_websocket_scope_from_request(request)

    assert scope["type"] == "websocket"
    assert scope["scheme"] == "wss"
    assert scope["path"] == "/_stcore/stream"
    assert scope["query_string"] == b"session=1"
    assert scope["server"] == ("example.com", 443)
    assert scope["subprotocols"] == ["chat", "streamlit"]
    assert is_websocket_upgrade(request) is True


def test_build_websocket_scope_from_request_decodes_path_and_preserves_raw_path():
    request = FakeRequest(
        "https://example.com/app/static/my%20image.png?session=1",
        {"Upgrade": "websocket"},
    )

    scope = build_websocket_scope_from_request(request)

    assert scope["path"] == "/app/static/my image.png"
    assert scope["raw_path"] == b"/app/static/my%20image.png"


@pytest.mark.asyncio
async def test_handshake_carries_the_subprotocol_chosen_by_the_app():
    async def subprotocol_app(scope, receive, send):
        assert (await receive())["type"] == "websocket.connect"
        await send(
            {"type": "websocket.accept", "subprotocol": scope["subprotocols"][0]}
        )

    socket = FakeSocket()
    scope = build_websocket_scope(
        WebSocketScopeParts(path="/_stcore/stream", subprotocols=["chat", "streamlit"])
    )
    session = AsgiWebSocketSession(subprotocol_app, socket, scope)

    task = session.start()
    handshake = await session.wait_for_handshake()
    await task

    assert handshake.accepted is True
    assert handshake.subprotocol == "chat"


@pytest.mark.asyncio
async def test_handshake_subprotocol_is_none_when_the_app_does_not_choose_one():
    socket = FakeSocket()
    scope = build_websocket_scope(
        WebSocketScopeParts(path="/_stcore/stream", subprotocols=["streamlit"])
    )
    session = AsgiWebSocketSession(echo_websocket_app, socket, scope)

    task = session.start()
    handshake = await session.wait_for_handshake()
    session.receive_text("hello")
    session.disconnect(1000)
    await task

    assert handshake.accepted is True
    assert handshake.subprotocol is None


@pytest.mark.asyncio
async def test_asgi_websocket_session_translates_messages():
    socket = FakeSocket()
    scope = build_websocket_scope(WebSocketScopeParts(path="/_stcore/stream"))
    session = AsgiWebSocketSession(echo_websocket_app, socket, scope)

    task = session.start()
    session.receive_text("hello")
    session.disconnect(1001)
    await task

    assert socket.accepted is True
    assert socket.sent == ["HELLO"]
    assert socket.closed == (1001, "")


@pytest.mark.asyncio
async def test_asgi_websocket_session_closes_socket_when_app_crashes_after_accept():
    async def crashing_app(scope, receive, send):
        assert (await receive())["type"] == "websocket.connect"
        await send({"type": "websocket.accept"})
        raise RuntimeError("boom")

    socket = FakeSocket()
    scope = build_websocket_scope(WebSocketScopeParts(path="/_stcore/stream"))
    session = AsgiWebSocketSession(crashing_app, socket, scope)

    task = session.start()
    with pytest.raises(RuntimeError, match="boom"):
        await task

    assert socket.closed == (1011, "")


@pytest.mark.asyncio
async def test_asgi_websocket_session_closes_socket_when_app_returns_without_close():
    async def returning_app(scope, receive, send):
        assert (await receive())["type"] == "websocket.connect"
        await send({"type": "websocket.accept"})

    socket = FakeSocket()
    scope = build_websocket_scope(WebSocketScopeParts(path="/_stcore/stream"))
    session = AsgiWebSocketSession(returning_app, socket, scope)

    await session.start()

    assert socket.closed == (1000, "")


@pytest.mark.asyncio
async def test_asgi_websocket_session_skips_close_after_client_disconnect():
    async def disconnect_aware_app(scope, receive, send):
        assert (await receive())["type"] == "websocket.connect"
        await send({"type": "websocket.accept"})
        assert (await receive())["type"] == "websocket.disconnect"

    socket = FakeSocket()
    scope = build_websocket_scope(WebSocketScopeParts(path="/_stcore/stream"))
    session = AsgiWebSocketSession(disconnect_aware_app, socket, scope)

    task = session.start()
    session.disconnect(1001)
    await task

    assert socket.closed is None


@pytest.mark.asyncio
async def test_asgi_websocket_session_rejects_before_accept_without_closing_socket():
    socket = FakeSocket()
    scope = build_websocket_scope(WebSocketScopeParts(path="/_stcore/stream"))
    session = AsgiWebSocketSession(reject_websocket_app, socket, scope)

    task = session.start()
    handshake = await session.wait_for_handshake()
    await task

    assert handshake.accepted is False
    assert handshake.code == 1008
    assert handshake.reason == "nope"
    assert socket.accepted is False
    assert socket.closed is None
