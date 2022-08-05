import asyncio
import threading

import pytest

import tornado
import streamlit
from streamlit.hello import Hello
from streamlit.server.server import Server


@pytest.fixture
def run_streamlit_background():
    """Mimic streamlit.cli.main_hello() """
    filename = Hello.__file__
    streamlit._is_running_with_streamlit = True

    # This setup and teardown code is based on `tornado.test.httpclient_test.torand`.
    # Ref: https://github.com/tornadoweb/tornado/blob/e72cc5769265abf0a279a293fa9cb383cff84db8/tornado/test/httpclient_test.py#L772-L792

    # Another thread where the Streamlit server will run
    server_evloop = asyncio.new_event_loop()
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


def test_http_server_websocket(run_streamlit_background):
    from tornado.httpserver import HTTP_SERVER

    HTTP_SERVER.start_websocket("/websocket")
    HTTP_SERVER.receive_websocket(b"")
