import tornado.web
from tornado.concurrent import Future

from typing import Callable, Union, Dict, Any


class WebSocketHandler(tornado.web.RequestHandler):
    def set_websocket_sender_fn(self, send_websocket_to_js: Callable):
        self._send_websocket_to_js = send_websocket_to_js

    def write_message(
        self, message: Union[bytes, str, Dict[str, Any]], binary: bool = False
    ) -> "Future[None]":
        self._send_websocket_to_js(message, binary)
