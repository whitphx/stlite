import asyncio
import threading
from unittest.mock import patch

import pytest

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
