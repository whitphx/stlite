import asyncio
import threading
from unittest.mock import patch, Mock

import pytest

import requests
import tornado
import streamlit
from streamlit.hello import Hello
from streamlit import config
from streamlit.server.server import Server


@pytest.fixture
def run_streamlit_background():
    """Mimic streamlit.cli.main_hello() """
    filename = Hello.__file__
    streamlit._is_running_with_streamlit = True

    config.set_option("server.fileWatcherType", "none", "<test>")  # Disable a file watcher

    # This setup and teardown code is based on `tornado.test.httpclient_test.torand`.
    # Ref: https://github.com/tornadoweb/tornado/blob/e72cc5769265abf0a279a293fa9cb383cff84db8/tornado/test/httpclient_test.py#L772-L792

    # Set up another thread where the Streamlit server will run
    server_evloop = asyncio.new_event_loop()
    asyncio.set_event_loop(server_evloop)
    event = threading.Event()

    data_from_thread = { "server": None,  "exception": None }
    async def init_server():
        """Mimic streamlit.bootstrap.run() """
        def on_start(server: Server):
            data_from_thread["server"] = server
            event.set()

        ioloop = tornado.ioloop.IOLoop.current()
        server = Server(ioloop, filename, [])
        server.start(on_start)

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
    thread.join()
    Server._singleton = None


def test_http_server_is_set(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    assert HTTP_SERVER is not None


@patch("streamlit.server.server.AppSession")
def test_http_server_websocket(AppSession, run_streamlit_background):
    session = AppSession()

    from tornado.httpserver import HTTP_SERVER
    from streamlit.proto import BackMsg_pb2

    backMsg = BackMsg_pb2.BackMsg()
    backMsg.stop_script = True

    def receive_websocket(payload):
        pass

    HTTP_SERVER.set_websocket_sender_fn(receive_websocket)

    HTTP_SERVER.start_websocket("/stream")

    HTTP_SERVER.receive_websocket(backMsg.SerializeToString())

    session.handle_stop_script_request.assert_called()


def test_http_get(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    on_response = Mock()

    task = HTTP_SERVER.receive_http("GET", "/healthz", {}, "", on_response)

    loop = task.get_loop()
    loop.run_until_complete(task)

    on_response.assert_called_with(200, { "Content-Type": "text/html; charset=UTF-8"}, b"ok")

def test_http_file_upload(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    # Initiate the session
    receive_websocket = Mock()
    HTTP_SERVER.set_websocket_sender_fn(receive_websocket)
    HTTP_SERVER.start_websocket("/stream")

    server = Server.get_current()
    session_ids = server._session_info_by_id.keys()
    session_id = list(session_ids)[0]

    req = requests.Request(
        "POST", "http://example.com:55555/upload_file",
        files={'file': ('foo.txt', 'Foo\nBar\nBaz')},
        data={"sessionId": session_id, "widgetId": "$$GENERATED_WIDGET_KEY-23195dab12a102415c4621538530154c-None"})
    r = req.prepare()

    on_response = Mock()

    task = HTTP_SERVER.receive_http("POST", "/upload_file", r.headers, r.body, on_response)

    loop = task.get_loop()
    loop.run_until_complete(task)

    on_response.assert_called_with(200, { "Content-Type": "text/html; charset=UTF-8"}, b"1")  # Returns 1, which is the ID of the first file.
