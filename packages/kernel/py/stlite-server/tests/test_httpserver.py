import asyncio
import threading
from typing import Any
from unittest.mock import ANY, Mock, patch

import pytest
import requests
from streamlit import config
from streamlit.hello import Hello
from streamlit.runtime.runtime import Runtime

from stlite_server.server import Server


@pytest.fixture
def setup_server():
    """Mimic streamlit.web.cli.main_hello()"""
    filename = Hello.__file__

    config.set_option(
        "server.fileWatcherType", "none", "<test>"
    )  # Disable a file watcher

    # This setup and teardown code is based on `tornado.test.httpclient_test.torand`.
    # Ref: https://github.com/tornadoweb/tornado/blob/e72cc5769265abf0a279a293fa9cb383cff84db8/tornado/test/httpclient_test.py#L772-L792  # noqa: E501

    # Set up another thread where the Streamlit server will run
    server_evloop = asyncio.new_event_loop()
    asyncio.set_event_loop(server_evloop)
    event = threading.Event()

    data_from_thread: dict[str, Any] = {"server": None, "exception": None}

    async def init_server():
        """Mimic streamlit.web.bootstrap.run()"""
        server = Server(filename, None)
        await server.start()
        data_from_thread["server"] = server
        event.set()

    def start():
        asyncio.set_event_loop(server_evloop)
        try:
            server_evloop.run_until_complete(init_server())
        except Exception as e:
            data_from_thread["exception"] = e
            event.set()

    thread = threading.Thread(target=start)
    thread.start()

    event.wait()

    exception = data_from_thread["exception"]
    if exception:
        raise exception
    server = data_from_thread["server"]

    yield server

    Runtime.instance().stop()
    server.stop()
    Runtime._instance = None
    thread.join()


@patch("streamlit.runtime.websocket_session_manager.AppSession")
def test_http_server_websocket(AppSession, setup_server):
    server: Server = setup_server

    session = AppSession()

    from streamlit import proto
    from streamlit.runtime.runtime_util import serialize_forward_msg

    backMsg = proto.BackMsg_pb2.BackMsg()
    backMsg.stop_script = True

    on_websocket_message = Mock()

    server.start_websocket("/_stcore/stream", on_websocket_message)

    server.receive_websocket(backMsg.SerializeToString())
    session.handle_backmsg.assert_called_with(backMsg)

    forwardMsg = proto.ForwardMsg_pb2.ForwardMsg(
        session_event=proto.SessionEvent_pb2.SessionEvent(script_changed_on_disk=True)
    )
    server._websocket_handler.write_forward_msg(forwardMsg)
    on_websocket_message.assert_called_with(
        serialize_forward_msg(forwardMsg), bool=True
    )


def test_http_get(setup_server):
    server: Server = setup_server

    on_response = Mock()

    task = server.receive_http("GET", "/healthz", {}, "", on_response)

    loop = task.get_loop()
    loop.run_until_complete(task)

    on_response.assert_called_with(200, ANY, b"ok")


@patch("streamlit.runtime.websocket_session_manager.AppSession")
def test_http_media_get(AppSession, setup_server):
    server: Server = setup_server

    url = Runtime.instance().media_file_mgr.add(
        b"Foo\nBar\nBaz", "text/plain", "1234", "foo.txt", is_for_static_download=True
    )

    on_response = Mock()

    server.receive_http("GET", url, {}, "", on_response)

    on_response.assert_called_with(200, ANY, b"Foo\nBar\nBaz")
    called_header = on_response.call_args[0][1]
    expected_header = {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="foo.txt"',
        "Content-Length": str(len(b"Foo\nBar\nBaz")),
    }
    assert called_header | expected_header == called_header


@patch("streamlit.runtime.websocket_session_manager.AppSession")
def test_http_file_upload(AppSession, setup_server):
    server: Server = setup_server

    app_session = AppSession.return_value
    app_session.id = (
        "foo"  # Every mocked AppSession's ID is fixed to be "foo" for test simplicity.
    )

    # Initiate the session
    receive_websocket = Mock()
    server.start_websocket("/_stcore/stream", receive_websocket)

    active_session = Runtime.instance()._session_mgr.list_active_sessions()[0].session

    req = requests.Request(
        "POST",
        "http://example.com:55555/_stcore/upload_file",
        files={"file": ("foo.txt", "Foo\nBar\nBaz")},
        data={
            "sessionId": active_session.id,
            "widgetId": "$$GENERATED_WIDGET_KEY-23195dab12a102415c4621538530154c-None",
        },
    )
    r = req.prepare()

    on_response = Mock()

    headers = dict(r.headers)
    body = r.body
    assert body is not None
    server.receive_http("POST", "/_stcore/upload_file", headers, body, on_response)

    on_response.assert_called_with(
        200, ANY, b"1"
    )  # Returns 1, which is the ID of the first file.
