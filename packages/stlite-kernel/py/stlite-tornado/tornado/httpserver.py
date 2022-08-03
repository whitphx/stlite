#
# Copyright 2009 Facebook
# Copyright 2022 Yuichiro Tachibana
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import sys
import re
import logging
from typing import Any, Callable, Optional

from tornado import gen
from tornado import httputil
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.websocket import WebSocketHandler

import pyodide

logger = logging.getLogger(__name__)


# HACK: Escape hatch to access the server instance from outside, e.g. Java Script world through Pyodide
HTTP_SERVER: Optional["HTTPServer"] = None


class HTTPServer:
    application: Application

    websocket_handler: Optional[WebSocketHandler] = None

    # The signature of __init__() is different from the original.
    # In this package, we handle only the case where an Application instance is passed here.
    def __init__(self, application: Application, *args: Any, **kwargs: Any) -> None:
        self.application = application

        global HTTP_SERVER
        if HTTP_SERVER:
            logger.warning("An HTTPServer instance already exists. Overwrite the global one.")
        HTTP_SERVER = self

    def set_websocket_sender_fn(self, send_websocket_to_js: Callable):
        self._send_websocket_to_js = send_websocket_to_js

    def start_websocket(self, path: str):
        websocket_handler_class = None
        kwargs = None
        for path_regex, handler_class, *rest in self.application.handlers:
            if issubclass(handler_class, WebSocketHandler) and re.match(path_regex, path):
                websocket_handler_class = handler_class
                if len(rest) > 0:
                    kwargs = rest[0]
                break
        if websocket_handler_class is None:
            logger.info("WebSocket connection for path %s has been requested, but no handler found", path)
            return

        # Streamlit's server.py checks the header for `st.user`: https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/lib/streamlit/server/server.py#L687
        # so set the headers here although the content is empty, which leads to a dummy local user identity.
        request = httputil.HTTPServerRequest(
            headers=httputil.HTTPHeaders()
        )

        logger.debug("Start WebSocket connection for %s using the handler %s", path, websocket_handler_class)
        websocket_handler = websocket_handler_class(request=request, **kwargs)
        websocket_handler.set_websocket_sender_fn(self._send_websocket_to_js)

        websocket_handler.open()

        self.websocket_handler = websocket_handler

    def receive_websocket_from_js(self, payload_from_js: pyodide.JsProxy):
        if self.websocket_handler is None:
            logger.warning("WebSocket is not open")
            return

        payload = payload_from_js.to_bytes()

        if not isinstance(payload, bytes):
            logger.warning("The WebSocket payload is not of type bytes, but %s", type(payload))
            return

        # Mimic https://github.com/tornadoweb/tornado/blob/43ae5839a56e445dd2d10539718f1e0c8053d995/tornado/websocket.py#L626-L645
        try:
            result = self.websocket_handler.on_message(payload)
        except Exception:
            self.handler.log_exception(*sys.exc_info())
            self._abort()
            return None
        else:
            if result is not None:
                result = gen.convert_yielded(result)
                IOLoop.current().add_future(result, lambda f: f.result())
            return result

    def listen(self, port: int, address: str = "") -> None:
        # Original implementation is on TCPServer.listen()
        pass  # Stlite: Do nothing
