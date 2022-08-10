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
from typing import Any, Callable, Optional, Union

from tornado import gen
from tornado import httputil
from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler
from tornado.websocket import WebSocketHandler

import pyodide

logger = logging.getLogger(__name__)


class JsConnection:
    """ Implementation of `httputil.HTTPConnection` (https://github.com/tornadoweb/tornado/blob/v6.2.0/tornado/httputil.py#L563)
    for communication with the stlite JavaScript code
    that replaces `HTTP1Connection` (https://github.com/tornadoweb/tornado/blob/v6.2.0/tornado/http1connection.py#L104)
    in the original Tornado code.
    """
    def __init__(self, callback) -> None:
        self._write_buffer = b""
        self._start_line = None
        self._headers = None
        self._callback = callback

    def write_headers(
        self,
        start_line: httputil.ResponseStartLine,
        headers: httputil.HTTPHeaders,
        chunk: Optional[bytes] = None,
    ) -> "Future[None]":
        logger.debug("JsConnection.write_headers(), %s, %s, %s", start_line, str(headers), chunk)
        self._start_line = start_line
        self._headers = headers
        self._write_buffer += chunk

    def write(self, chunk: bytes) -> "Future[None]":
        logger.debug("JsConnection.write(), %s", chunk)
        self._write_buffer += chunk

    def finish(self) -> None:
        logger.debug("JsConnection.flush()")
        if self._start_line is None:
            raise Exception("start line is not set")
        if self._headers is None:
            raise Exception("headers are not set")
        self._callback(self._start_line.code, dict(self._headers), self._write_buffer)


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

        self.receive_websocket(payload)

    def receive_websocket(self, payload: bytes):
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

    def receive_http_from_js(self, method: str, path: str, headers: pyodide.JsProxy, body: pyodide.JsProxy, on_response: Callable[[int, dict, bytes], None]):
        return self.receive_http(method=method, path=path, headers=headers.to_py(), body=body.to_bytes(), on_response=on_response)

    def receive_http(self, method: str, path: str, headers: dict, body: Union[str, bytes], on_response: Callable[[int, dict, bytes], None]):
        logger.debug("HTTP request (%s %s %s %s)", method, path, headers, body)

        request_handler_class = None
        kwargs = None
        for path_regex, handler_class, *rest in self.application.handlers:
            if issubclass(handler_class, RequestHandler) and re.match(path_regex, path):
                request_handler_class = handler_class
                if len(rest) > 0:
                    kwargs = rest[0]
                break
        if request_handler_class is None:
            logger.info("HTTP request for path %s has been sent, but no handler found", path)
            return

        request = httputil.HTTPServerRequest(
            method=method,
            headers=headers,
            body=body if isinstance(body, bytes) else body.encode("utf8"),
            connection=JsConnection(on_response),
        )

        handler = request_handler_class(request=request, **kwargs)

        # Mimic tornado.web._HandlerDelegate.execute()
        # Ref: https://github.com/tornadoweb/tornado/blob/v6.2.0/tornado/web.py#L2330
        transforms = []
        path_args = []  # TODO
        path_kwargs = {}  # TODO
        fut = gen.convert_yielded(
            handler._execute(transforms, *path_args, **path_kwargs)
        )
        return fut

    def listen(self, port: int, address: str = "") -> None:
        # Original implementation is on TCPServer.listen()
        pass  # Stlite: Do nothing
