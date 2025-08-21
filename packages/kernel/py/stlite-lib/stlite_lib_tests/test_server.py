import asyncio
import os
import uuid
from unittest.mock import ANY, Mock, patch

import pytest
import pytest_asyncio
import requests
from streamlit import config, runtime
from streamlit.runtime.scriptrunner_utils.script_run_context import add_script_run_ctx
from tests.testutil import create_mock_script_run_ctx

from stlite_lib.server import Server


@pytest_asyncio.fixture
async def setup_server():
    config.set_option(
        "server.fileWatcherType", "none", "<test>"
    )  # Disable a file watcher

    server = None

    async def _setup():
        # To call `server.start()` in the same task as the test case,
        # we return `_setup` from the fixture and call it in the test case.
        nonlocal server

        from streamlit.hello import hello

        filename = hello.__file__
        server = Server(filename)
        await server.start()

        add_script_run_ctx(
            asyncio.current_task(), create_mock_script_run_ctx()
        )  # Like https://github.com/streamlit/streamlit/blob/1.35.0/lib/tests/streamlit/runtime/caching/cache_resource_api_test.py#L46-L48  # noqa: E501

        return server

    yield _setup

    server.stop()
    await server._runtime.stopped


@pytest.mark.asyncio
@patch("streamlit.runtime.websocket_session_manager.AppSession")
async def test_http_server_websocket(AppSession, setup_server):
    server: Server = await setup_server()

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
    on_websocket_message.assert_called_with(serialize_forward_msg(forwardMsg), True)


@pytest.mark.asyncio
async def test_http_get_health(setup_server):
    server: Server = await setup_server()

    on_response = Mock()

    await server.receive_http("GET", "/healthz", {}, "", on_response)

    on_response.assert_called_with(200, ANY, b"ok")


@pytest.mark.asyncio
async def test_http_media(setup_server):
    server: Server = await setup_server()

    on_response = Mock()

    # For the case where the file name is set
    url1 = runtime.get_instance().media_file_mgr.add(
        b"Foo1\nFoo2\nFoo3",
        "text/plain",
        "1234",
        "foo.txt",
        is_for_static_download=True,
    )

    server.receive_http("GET", url1, {}, "", on_response)
    on_response.assert_called_with(200, ANY, b"Foo1\nFoo2\nFoo3")
    called_header = on_response.call_args[0][1]
    expected_header = {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="foo.txt"',
        "Content-Length": str(len(b"Foo1\nFoo2\nFoo3")),
    }
    assert called_header | expected_header == called_header

    # For the case where the file name is None
    url2 = runtime.get_instance().media_file_mgr.add(
        b"Bar1\nBar2\nBar3", "text/plain", "1234", None, is_for_static_download=True
    )

    server.receive_http("GET", url2, {}, "", on_response)  # No query parameter
    on_response.assert_called_with(200, ANY, b"Bar1\nBar2\nBar3")
    called_header = on_response.call_args[0][1]
    expected_header = {
        "Content-Type": "text/plain",
        "Content-Length": str(len(b"Bar1\nBar2\nBar3")),
    }
    assert called_header | expected_header == called_header
    assert (
        called_header["Content-Disposition"]
        == 'attachment; filename="streamlit_download.txt"'
    )
    on_response.reset_mock()


@pytest.mark.asyncio
@patch("streamlit.runtime.websocket_session_manager.AppSession")
async def test_http_file_upload(AppSession, setup_server):
    server: Server = await setup_server()

    app_session = AppSession.return_value
    app_session.id = (
        "foo"  # Every mocked AppSession's ID is fixed to be "foo" for test simplicity.
    )

    # Initiate the session
    receive_websocket = Mock()
    server.start_websocket("/_stcore/stream", receive_websocket)

    active_session = (
        runtime.get_instance()._session_mgr.list_active_sessions()[0].session
    )

    file_id = str(uuid.uuid4())

    req = requests.Request(
        "PUT",
        f"http://example.com:55555/_stcore/upload_file/{active_session.id}/{file_id}",
        files={"file": ("foo.txt", "Foo\nBar\nBaz")},
    )
    r = req.prepare()

    on_response = Mock()

    headers = dict(r.headers)
    body = r.body
    assert body is not None
    server.receive_http(
        "PUT",
        f"/_stcore/upload_file/{active_session.id}/{file_id}",
        headers,
        body,
        on_response,
    )

    on_response.assert_called_with(204, ANY, b"")


@pytest.mark.asyncio
@patch("streamlit.runtime.websocket_session_manager.AppSession")
async def test_http_file_delete(AppSession, setup_server):
    server: Server = await setup_server()

    app_session = AppSession.return_value
    app_session.id = (
        "foo"  # Every mocked AppSession's ID is fixed to be "foo" for test simplicity.
    )

    # Initiate the session
    receive_websocket = Mock()
    server.start_websocket("/_stcore/stream", receive_websocket)

    active_session = (
        runtime.get_instance()._session_mgr.list_active_sessions()[0].session
    )

    file_id = str(uuid.uuid4())

    # Delete the file
    on_response = Mock()
    server.receive_http(
        "DELETE",
        f"/_stcore/upload_file/{active_session.id}/{file_id}",
        {},
        "",
        on_response,
    )
    on_response.assert_called_with(204, ANY, b"")


@pytest.mark.asyncio
async def test_http_component(setup_server):
    server: Server = await setup_server()

    import streamlit_folium

    with open(
        os.path.join(streamlit_folium._component_func._path, "index.html"), "rb"
    ) as folium_index_html:
        folium_index_html_contents = folium_index_html.read()

    on_response = Mock()

    server.receive_http(
        "GET",
        rf"/component/{streamlit_folium._component_func.name}/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2F",  # noqa: E501
        {},
        "",
        on_response,
    )
    on_response.assert_called_with(
        200, {"Content-Type": "text/html"}, folium_index_html_contents
    )
