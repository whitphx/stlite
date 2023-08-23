# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Server.py unit tests"""

import asyncio
import contextlib
import errno
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock
from unittest.mock import patch

import pytest
import tornado.httpserver
import tornado.testing
import tornado.web
import tornado.websocket
from parameterized import parameterized

import streamlit.web.server.server
from streamlit import config
from streamlit.logger import get_logger
from streamlit.proto.ForwardMsg_pb2 import ForwardMsg
from streamlit.runtime import Runtime, RuntimeState
from streamlit.web.server.server import (
    MAX_PORT_SEARCH_RETRIES,
    RetriesExceeded,
    Server,
    start_listening,
)
from tests.streamlit.message_mocks import create_dataframe_msg
from tests.streamlit.web.server.server_test_case import ServerTestCase
from tests.testutil import patch_config_options

LOGGER = get_logger(__name__)


def _create_script_finished_msg(status) -> ForwardMsg:
    msg = ForwardMsg()
    msg.script_finished = status
    return msg


def _patch_local_sources_watcher():
    """Return a mock.patch for LocalSourcesWatcher"""
    return patch("streamlit.runtime.runtime.LocalSourcesWatcher")


class ServerTest(ServerTestCase):
    def setUp(self) -> None:
        self.original_ws_compression = config.get_option(
            "server.enableWebsocketCompression"
        )
        return super().setUp()

    def tearDown(self):
        config.set_option(
            "server.enableWebsocketCompression", self.original_ws_compression
        )
        return super().tearDown()

    @tornado.testing.gen_test
    async def test_start_stop(self):
        """Test that we can start and stop the server."""
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()
            self.assertEqual(
                RuntimeState.NO_SESSIONS_CONNECTED, self.server._runtime._state
            )

            await self.ws_connect()
            self.assertEqual(
                RuntimeState.ONE_OR_MORE_SESSIONS_CONNECTED, self.server._runtime._state
            )

            self.server.stop()
            await asyncio.sleep(0)  # Wait a tick for the stop to be acknowledged
            self.assertEqual(RuntimeState.STOPPING, self.server._runtime._state)

            await asyncio.sleep(0.1)
            self.assertEqual(RuntimeState.STOPPED, self.server._runtime._state)

    @tornado.testing.gen_test
    async def test_websocket_connect(self):
        """Test that we can connect to the server via websocket."""
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()

            self.assertFalse(self.server.browser_is_connected)

            # Open a websocket connection
            ws_client = await self.ws_connect()
            self.assertTrue(self.server.browser_is_connected)

            # Get this client's SessionInfo object
            self.assertEqual(1, self.server._runtime._session_mgr.num_active_sessions())
            session_info = self.server._runtime._session_mgr.list_active_sessions()[0]

            # Close the connection
            ws_client.close()
            await asyncio.sleep(0.1)
            self.assertFalse(self.server.browser_is_connected)

            # Ensure AppSession.disconnect_file_watchers() was called, and that our
            # session exists but is no longer active.
            session_info.session.disconnect_file_watchers.assert_called_once()
            self.assertEqual(0, self.server._runtime._session_mgr.num_active_sessions())
            self.assertEqual(1, self.server._runtime._session_mgr.num_sessions())

    @tornado.testing.gen_test
    async def test_websocket_connect_to_nonexistent_session(self):
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()

            ws_client = await self.ws_connect(existing_session_id="nonexistent_session")

            session_info = self.server._runtime._session_mgr.list_active_sessions()[0]

            self.assertNotEqual(session_info.session.id, "nonexistent_session")

            ws_client.close()
            await asyncio.sleep(0.1)

    @tornado.testing.gen_test
    async def test_websocket_disconnect_and_reconnect(self):
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()

            ws_client = await self.ws_connect()
            original_session_info = (
                self.server._runtime._session_mgr.list_active_sessions()[0]
            )

            # Disconnect, reconnect with the same session_id, and confirm that the
            # session was reused.
            ws_client.close()
            await asyncio.sleep(0.1)

            ws_client = await self.ws_connect(
                existing_session_id=original_session_info.session.id
            )

            self.assertEqual(self.server._runtime._session_mgr.num_active_sessions(), 1)
            new_session_info = self.server._runtime._session_mgr.list_active_sessions()[
                0
            ]
            self.assertEqual(new_session_info.session, original_session_info.session)

            ws_client.close()
            await asyncio.sleep(0.1)

    @tornado.testing.gen_test
    async def test_multiple_connections(self):
        """Test multiple websockets can connect simultaneously."""
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()

            self.assertFalse(self.server.browser_is_connected)

            # Open a websocket connection
            ws_client1 = await self.ws_connect()
            self.assertTrue(self.server.browser_is_connected)

            # Open another
            ws_client2 = await self.ws_connect()
            self.assertTrue(self.server.browser_is_connected)

            # Assert that our session_infos are sane
            session_infos = self.server._runtime._session_mgr.list_active_sessions()
            self.assertEqual(2, len(session_infos))
            self.assertNotEqual(
                session_infos[0].session.id,
                session_infos[1].session.id,
            )

            # Close the first
            ws_client1.close()
            await asyncio.sleep(0.1)
            self.assertTrue(self.server.browser_is_connected)

            # Close the second
            ws_client2.close()
            await asyncio.sleep(0.1)
            self.assertFalse(self.server.browser_is_connected)

    @tornado.testing.gen_test
    async def test_websocket_compression(self):
        with _patch_local_sources_watcher(), self._patch_app_session():
            config._set_option("server.enableWebsocketCompression", True, "test")
            await self.server.start()

            # Connect to the server, and explicitly request compression.
            ws_client = await tornado.websocket.websocket_connect(
                self.get_ws_url("/_stcore/stream"), compression_options={}
            )

            # Ensure that the "permessage-deflate" extension is returned
            # from the server.
            extensions = ws_client.headers.get("Sec-Websocket-Extensions")
            self.assertIn("permessage-deflate", extensions)

    @tornado.testing.gen_test
    async def test_websocket_compression_disabled(self):
        with _patch_local_sources_watcher(), self._patch_app_session():
            config._set_option("server.enableWebsocketCompression", False, "test")
            await self.server.start()

            # Connect to the server, and explicitly request compression.
            ws_client = await tornado.websocket.websocket_connect(
                self.get_ws_url("/_stcore/stream"), compression_options={}
            )

            # Ensure that the "Sec-Websocket-Extensions" header is not
            # present in the response from the server.
            self.assertIsNone(ws_client.headers.get("Sec-Websocket-Extensions"))

    @tornado.testing.gen_test
    async def test_send_message_to_disconnected_websocket(self):
        """Sending a message to a disconnected SessionClient raises an error.
        We should gracefully handle the error by cleaning up the session.
        """
        with _patch_local_sources_watcher(), self._patch_app_session():
            await self.server.start()
            await self.ws_connect()

            # Get the server's socket and session for this client
            session_info = self.server._runtime._session_mgr.list_active_sessions()[0]

            with patch.object(
                session_info.session, "flush_browser_queue"
            ) as flush_browser_queue, patch.object(
                session_info.client, "write_message"
            ) as ws_write_message:
                # Patch flush_browser_queue to simulate a pending message.
                flush_browser_queue.return_value = [create_dataframe_msg([1, 2, 3])]

                # Patch the session's WebsocketHandler to raise a
                # WebSocketClosedError when we write to it.
                ws_write_message.side_effect = tornado.websocket.WebSocketClosedError()

                # Tick the server. Our session's browser_queue will be flushed,
                # and the Websocket client's write_message will be called,
                # raising our WebSocketClosedError.
                while not flush_browser_queue.called:
                    self.server._runtime._get_async_objs().need_send_data.set()
                    await asyncio.sleep(0)

                flush_browser_queue.assert_called_once()
                ws_write_message.assert_called_once()

                # Our session should have been removed from the server as
                # a result of the WebSocketClosedError.
                self.assertIsNone(
                    self.server._runtime._session_mgr.get_active_session_info(
                        session_info.session.id
                    )
                )


class PortRotateAHundredTest(unittest.TestCase):
    """Tests port rotation handles a MAX_PORT_SEARCH_RETRIES attempts then sys exits"""

    def setUp(self) -> None:
        self.original_port = config.get_option("server.port")
        return super().setUp()

    def tearDown(self) -> None:
        config.set_option("server.port", self.original_port)
        return super().tearDown()

    @staticmethod
    def get_httpserver():
        httpserver = mock.MagicMock()

        httpserver.listen = mock.Mock()
        httpserver.listen.side_effect = OSError(errno.EADDRINUSE, "test", "asd")

        return httpserver

    def test_rotates_a_hundred_ports(self):
        app = mock.MagicMock()

        RetriesExceeded = streamlit.web.server.server.RetriesExceeded
        with pytest.raises(RetriesExceeded) as pytest_wrapped_e:
            with patch(
                "streamlit.web.server.server.HTTPServer",
                return_value=self.get_httpserver(),
            ) as mock_server:
                start_listening(app)
                self.assertEqual(pytest_wrapped_e.type, SystemExit)
                self.assertEqual(pytest_wrapped_e.value.code, errno.EADDRINUSE)
                self.assertEqual(mock_server.listen.call_count, MAX_PORT_SEARCH_RETRIES)


class PortRotateOneTest(unittest.TestCase):
    """Tests port rotates one port"""

    which_port = mock.Mock()

    @staticmethod
    def get_httpserver():
        httpserver = mock.MagicMock()

        httpserver.listen = mock.Mock()
        httpserver.listen.side_effect = OSError(errno.EADDRINUSE, "test", "asd")

        return httpserver

    @mock.patch("streamlit.web.server.server.config._set_option")
    @mock.patch("streamlit.web.server.server.server_port_is_manually_set")
    def test_rotates_one_port(
        self, patched_server_port_is_manually_set, patched__set_option
    ):
        app = mock.MagicMock()

        patched_server_port_is_manually_set.return_value = False
        with pytest.raises(RetriesExceeded):
            with patch(
                "streamlit.web.server.server.HTTPServer",
                return_value=self.get_httpserver(),
            ):
                start_listening(app)

                PortRotateOneTest.which_port.assert_called_with(8502)

                patched__set_option.assert_called_with(
                    "server.port", 8501, config.ConfigOption.STREAMLIT_DEFINITION
                )


class SslServerTest(unittest.TestCase):
    """Tests SSL server"""

    @parameterized.expand(["server.sslCertFile", "server.sslKeyFile"])
    def test_requires_two_options(self, option_name):
        """
        The test checks the behavior whenever one of the two required configuration
        option is set.
        """
        with patch_config_options({option_name: "/tmp/file"}), pytest.raises(
            SystemExit
        ), self.assertLogs("streamlit.web.server.server") as logs:
            start_listening(mock.MagicMock())
        self.assertEqual(
            logs.output,
            [
                "ERROR:streamlit.web.server.server:Options 'server.sslCertFile' and "
                "'server.sslKeyFile' must be set together. Set missing options or "
                "delete existing options."
            ],
        )

    @parameterized.expand(["server.sslCertFile", "server.sslKeyFile"])
    def test_missing_file(self, option_name):
        """
        The test checks the behavior whenever one of the two requires file is missing.
        """
        with contextlib.ExitStack() as exit_stack:
            tmp_dir = exit_stack.enter_context(tempfile.TemporaryDirectory())

            cert_file = Path(tmp_dir) / "cert.cert"
            key_file = Path(tmp_dir) / "key.key"

            new_options = {
                "server.sslCertFile": cert_file,
                "server.sslKeyFile": key_file,
            }
            exit_stack.enter_context(patch_config_options(new_options))

            # Create only one file
            Path(new_options[option_name]).write_text("TEST-CONTENT")

            exit_stack.enter_context(pytest.raises(SystemExit))
            logs = exit_stack.enter_context(
                self.assertLogs("streamlit.web.server.server")
            )

            start_listening(mock.MagicMock())

        self.assertRegex(
            logs.output[0],
            r"ERROR:streamlit\.web\.server\.server:(Cert|Key) file "
            r"'.+' does not exist\.",
        )

    @parameterized.expand(["server.sslCertFile", "server.sslKeyFile"])
    def test_invalid_file_content(self, option_name):
        """
        The test checks the behavior whenever one of the two requires file is corrupted.
        """
        with contextlib.ExitStack() as exit_stack:
            tmp_dir = exit_stack.enter_context(tempfile.TemporaryDirectory())
            cert_file = Path(tmp_dir) / "cert.cert"
            key_file = Path(tmp_dir) / "key.key"

            subprocess.check_call(
                [
                    "openssl",
                    "req",
                    "-x509",
                    "-newkey",
                    "rsa:4096",
                    "-keyout",
                    str(key_file),
                    "-out",
                    str(cert_file),
                    "-sha256",
                    "-days",
                    "365",
                    "-nodes",
                    "-subj",
                    "/CN=localhost",
                    # sublectAltName is required by modern browsers
                    # See: https://github.com/urllib3/urllib3/issues/497
                    "-addext",
                    "subjectAltName = DNS:localhost",
                ]
            )
            new_options = {
                "server.sslCertFile": cert_file,
                "server.sslKeyFile": key_file,
            }
            exit_stack.enter_context(patch_config_options(new_options))

            # Overwrite file with invalid content
            Path(new_options[option_name]).write_text("INVALID-CONTENT")

            exit_stack.enter_context(pytest.raises(SystemExit))
            logs = exit_stack.enter_context(
                self.assertLogs("streamlit.web.server.server")
            )

            start_listening(mock.MagicMock())
        self.assertRegex(
            logs.output[0],
            r"ERROR:streamlit\.web\.server\.server:Failed to load SSL certificate\. "
            r"Make sure cert file '.+' and key file '.+' are correct\.",
        )


class UnixSocketTest(unittest.TestCase):
    """Tests start_listening uses a unix socket when socket.address starts with
    unix://"""

    def setUp(self) -> None:
        self.original_address = config.get_option("server.address")
        return super().setUp()

    def tearDown(self) -> None:
        config.set_option("server.address", self.original_address)
        return super().tearDown()

    @staticmethod
    def get_httpserver():
        httpserver = mock.MagicMock()

        httpserver.add_socket = mock.Mock()

        return httpserver

    def test_unix_socket(self):
        app = mock.MagicMock()

        config.set_option("server.address", "unix://~/fancy-test/testasd")
        some_socket = object()

        mock_server = self.get_httpserver()
        with patch(
            "streamlit.web.server.server.HTTPServer", return_value=mock_server
        ), patch.object(
            tornado.netutil, "bind_unix_socket", return_value=some_socket
        ) as bind_unix_socket, patch.dict(
            os.environ, {"HOME": "/home/superfakehomedir"}
        ):
            start_listening(app)

            bind_unix_socket.assert_called_with(
                "/home/superfakehomedir/fancy-test/testasd"
            )
            mock_server.add_socket.assert_called_with(some_socket)


class ScriptCheckEndpointExistsTest(tornado.testing.AsyncHTTPTestCase):
    async def does_script_run_without_error(self):
        return True, "test_message"

    def setUp(self):
        self._old_config = config.get_option("server.scriptHealthCheckEnabled")
        config._set_option("server.scriptHealthCheckEnabled", True, "test")
        super().setUp()

    def tearDown(self):
        config._set_option("server.scriptHealthCheckEnabled", self._old_config, "test")
        Runtime._instance = None
        super().tearDown()

    def get_app(self):
        server = Server("mock/script/path", "test command line")
        server._runtime.does_script_run_without_error = (
            self.does_script_run_without_error
        )
        server._runtime._eventloop = self.io_loop.asyncio_loop
        return server._create_app()

    def test_endpoint(self):
        response = self.fetch("/_stcore/script-health-check")
        self.assertEqual(200, response.code)
        self.assertEqual(b"test_message", response.body)

    def test_deprecated_endpoint(self):
        response = self.fetch("/script-health-check")
        self.assertEqual(200, response.code)
        self.assertEqual(b"test_message", response.body)
        self.assertEqual(
            response.headers["link"],
            f'<http://127.0.0.1:{self.get_http_port()}/_stcore/script-health-check>; rel="alternate"',
        )
        self.assertEqual(response.headers["deprecation"], "True")


class ScriptCheckEndpointDoesNotExistTest(tornado.testing.AsyncHTTPTestCase):
    async def does_script_run_without_error(self):
        self.fail("Should not be called")

    def setUp(self):
        self._old_config = config.get_option("server.scriptHealthCheckEnabled")
        config._set_option("server.scriptHealthCheckEnabled", False, "test")
        super().setUp()

    def tearDown(self):
        config._set_option("server.scriptHealthCheckEnabled", self._old_config, "test")
        Runtime._instance = None
        super().tearDown()

    def get_app(self):
        server = Server("mock/script/path", "test command line")
        server._runtime.does_script_run_without_error = (
            self.does_script_run_without_error
        )
        return server._create_app()

    def test_endpoint(self):
        response = self.fetch("/script-health-check")
        self.assertEqual(404, response.code)
