import asyncio
import threading
from typing import Any
from unittest.mock import ANY, Mock, patch

import pytest
import requests
import tornado
from streamlit import config
from streamlit.hello import Hello
from streamlit.runtime.runtime import Runtime
from streamlit.web.server.server import Server


@pytest.fixture
def run_streamlit_background():
    """Mimic streamlit.web.cli.main_hello()"""
    filename = Hello.__file__

    config.set_option(
        "server.fileWatcherType", "none", "<test>"
    )  # Disable a file watcher
    config.set_option("server.enableXsrfProtection", False, "<test>")

    # This setup and teardown code is based on `tornado.test.httpclient_test.torand`.
    # Ref: https://github.com/tornadoweb/tornado/blob/e72cc5769265abf0a279a293fa9cb383cff84db8/tornado/test/httpclient_test.py#L772-L792  # noqa: E501

    # Set up another thread where the Streamlit server will run
    server_evloop = asyncio.new_event_loop()
    asyncio.set_event_loop(server_evloop)
    event = threading.Event()

    data_from_thread: dict[str, Any] = {"server": None, "exception": None}

    async def init_server():
        """Mimic streamlit.web.bootstrap.run()"""
        tornado.ioloop.IOLoop.current()
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

    yield

    server.stop()
    Runtime._instance = None
    thread.join()


def test_http_server_is_set(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    assert HTTP_SERVER is not None


@patch("streamlit.runtime.websocket_session_manager.AppSession")
def test_http_server_websocket(AppSession, run_streamlit_background):
    session = AppSession()

    from streamlit.proto import BackMsg_pb2
    from tornado.httpserver import HTTP_SERVER

    assert HTTP_SERVER is not None

    backMsg = BackMsg_pb2.BackMsg()
    backMsg.stop_script = True

    on_websocket_message = Mock()

    HTTP_SERVER.start_websocket("/_stcore/stream", on_websocket_message)

    HTTP_SERVER.receive_websocket(backMsg.SerializeToString())
    session.handle_backmsg.assert_called_with(backMsg)

    HTTP_SERVER.websocket_handler.write_message(b"foobar", binary=True)
    on_websocket_message.assert_called_with(b"foobar", binary=True)


def test_http_get(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    assert HTTP_SERVER is not None

    on_response = Mock()

    task = HTTP_SERVER.receive_http("GET", "/healthz", {}, "", on_response)

    loop = task.get_loop()
    loop.run_until_complete(task)

    on_response.assert_called_with(200, ANY, b"ok")


@patch("streamlit.runtime.websocket_session_manager.AppSession")
def test_http_file_upload(AppSession, run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    assert HTTP_SERVER is not None

    app_session = AppSession.return_value
    app_session.id = (
        "foo"  # Every mocked AppSession's ID is fixed to be "foo" for test simplicity.
    )

    # Initiate the session
    receive_websocket = Mock()
    HTTP_SERVER.start_websocket("/_stcore/stream", receive_websocket)

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
    task = HTTP_SERVER.receive_http(
        "POST", "/_stcore/upload_file", headers, body, on_response
    )

    loop = task.get_loop()
    loop.run_until_complete(task)

    on_response.assert_called_with(
        200, ANY, b"1"
    )  # Returns 1, which is the ID of the first file.
