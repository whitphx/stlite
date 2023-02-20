import asyncio
import logging
import re
from typing import Callable, Dict, Final, List, Optional, Tuple, Union, cast

import pyodide
from streamlit.proto.BackMsg_pb2 import BackMsg
from streamlit.proto.ForwardMsg_pb2 import ForwardMsg
from streamlit.runtime import Runtime, RuntimeConfig, SessionClient
from streamlit.runtime.memory_media_file_storage import MemoryMediaFileStorage
from streamlit.runtime.runtime_util import serialize_forward_msg

from .handler import RequestHandler
from .health_handler import HealthHandler, Request
from .media_file_handler import MediaFileHandler
from .server_util import make_url_path_regex
from .upload_file_request_handler import UPLOAD_FILE_ROUTE, UploadFileRequestHandler

LOGGER = logging.getLogger(__name__)

MEDIA_ENDPOINT: Final = "/media"
STREAM_ENDPOINT: Final = r"_stcore/stream"
METRIC_ENDPOINT: Final = r"(?:st-metrics|_stcore/metrics)"
MESSAGE_ENDPOINT: Final = r"_stcore/message"
HEALTH_ENDPOINT: Final = r"(?:healthz|_stcore/health)"
ALLOWED_MESSAGE_ORIGIN_ENDPOINT: Final = r"_stcore/allowed-message-origins"
SCRIPT_HEALTH_CHECK_ENDPOINT: Final = (
    r"(?:script-health-check|_stcore/script-health-check)"
)


class Server:
    _routes: List[Tuple[re.Pattern, RequestHandler]] = []

    def __init__(self, main_script_path: str, command_line: Optional[str]) -> None:
        self._main_script_path = main_script_path

        self._media_file_storage = MemoryMediaFileStorage(MEDIA_ENDPOINT)

        self._runtime = Runtime(
            RuntimeConfig(
                script_path=main_script_path,
                command_line=command_line,
                media_file_storage=self._media_file_storage,
            ),
        )

        self._runtime.stats_mgr.register_provider(self._media_file_storage)

    async def start(self) -> None:
        """Start the server.

        When this returns, Streamlit is ready to accept new sessions.
        """

        LOGGER.debug("Starting server...")

        self._websocket_handler = WebSocketHandler(self._runtime)

        # Based on the original impl at https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/server.py#L221  # noqa: E501
        base = ""  # The original impl reads the `server.baseUrlPath` config, but we use a fixed empty string.  # noqa: E501
        routes = [
            (
                make_url_path_regex(base, HEALTH_ENDPOINT),
                HealthHandler(
                    callback=lambda: self._runtime.is_ready_for_browser_connection
                ),
            ),
            (
                make_url_path_regex(
                    base,
                    UPLOAD_FILE_ROUTE,
                ),
                UploadFileRequestHandler(
                    file_mgr=self._runtime.uploaded_file_mgr,
                    is_active_session=self._runtime.is_active_session,
                ),
            ),
            (
                make_url_path_regex(base, f"{MEDIA_ENDPOINT}/(.*)"),
                MediaFileHandler(self._media_file_storage),
            ),
        ]
        self._routes = [(re.compile(pattern), handler) for (pattern, handler) in routes]

        await self._runtime.start()

    def start_websocket(self, path: str, on_message):
        if not re.match(make_url_path_regex(STREAM_ENDPOINT), path):
            raise RuntimeError("Invalid WebSocket endpoint")
        self._websocket_handler.open(on_message)

    def receive_websocket(self, message: bytes):
        self._websocket_handler.on_message(message)

    def receive_websocket_from_js(self, payload_from_js: pyodide.ffi.JsProxy):
        payload = payload_from_js.to_bytes()

        if not isinstance(payload, bytes):
            LOGGER.warning(
                "The WebSocket payload is not of type bytes, but %s", type(payload)
            )
            return

        self.receive_websocket(payload)

    def receive_http_from_js(
        self,
        method: str,
        path: str,
        headers: pyodide.ffi.JsProxy,
        body: Union[str, pyodide.ffi.JsProxy],
        on_response: Callable[[int, dict, bytes], None],
    ):
        headers = headers.to_py()

        if isinstance(body, pyodide.ffi.JsProxy):
            body = body.to_bytes()

        return self.receive_http(
            method=method,
            path=path,
            headers=headers,
            body=body,
            on_response=on_response,
        )

    def receive_http(
        self,
        method: str,
        path: str,
        headers: dict,
        body: Union[str, bytes],
        on_response: Callable[[int, dict, bytes], None],
    ):
        LOGGER.debug("HTTP request (%s %s %s %s)", method, path, headers, body)

        # Find the handler for the path and method.
        handler = None
        for path_regex, handler_candidate in self._routes:
            match = path_regex.match(path)
            if match:
                handler = handler_candidate
                break
        if handler is None:
            on_response(404, {}, b"")
            return
        method_name = method.lower()
        if method_name not in ("get", "post"):
            on_response(405, {}, b"Now allowed")
            return
        handle_method = getattr(handler, method_name, None)
        if handle_method is None:
            on_response(405, {}, b"")
            return

        # Parse args and kwargs from the path pattern emulating Tornado's URL routing.
        match = cast(re.Match[str], match)
        args = match.groups()
        kwargs = match.groupdict()
        kwarg_indexes = (
            path_regex.groupindex.values()
        )  # These args are also captured in kwargs, so we remove them from args. Note that these indexes are 1-based.  # noqa: E501
        args_no_dup = []
        for i, arg in enumerate(args):
            if (
                i + 1 not in kwarg_indexes
            ):  # Compare 0-based indexes with 1-based indexes
                args_no_dup.append(arg)

        # Call the handler method.
        request = Request(path=path, headers=headers, body=body)
        res_or_coro = handle_method(request, *args_no_dup, **kwargs)
        if asyncio.iscoroutine(res_or_coro):
            task = asyncio.ensure_future(res_or_coro)

            def callback(future: asyncio.Future):
                status, res_headers, res_body = future.result()
                if isinstance(res_body, str):
                    res_body = res_body.encode("utf-8")
                on_response(status, res_headers, res_body)

            task.add_done_callback(callback)
            return task

        status, res_headers, res_body = res_or_coro
        if isinstance(res_body, str):
            res_body = res_body.encode("utf-8")
        on_response(status, res_headers, res_body)
        return

    def stop(self):
        self._websocket_handler.on_close()


class WebSocketHandler(SessionClient):
    """
    This class is a replacement for the class of the same name in
    streamlit.web.server.browser_websocket_handler.py.
    The implementation is based on the original WebSocketHandler in
    https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/browser_websocket_handler.py.  # noqa: E501
    """

    _runtime: Runtime
    _session_id: Optional[str]
    _callback: Optional[Callable[[bytes, bool], None]]

    def __init__(self, runtime: Runtime) -> None:
        self._runtime = runtime
        self._session_id = None

    def write_forward_msg(self, msg: ForwardMsg) -> None:
        """Send a ForwardMsg to the browser."""
        self._callback(serialize_forward_msg(msg), bool=True)

    def open(self, on_message: Callable[[bytes], None]) -> None:
        self._callback = on_message

        # Omit the original implementation in browser_websocket_handler.py here,
        # and just use empty values for these objects.
        user_info: Dict[str, Optional[str]] = dict()
        existing_session_id = None

        self._session_id = self._runtime.connect_session(
            client=self,  #
            user_info=user_info,
            existing_session_id=existing_session_id,
        )

    def on_close(self) -> None:
        if not self._session_id:
            return
        self._runtime.disconnect_session(self._session_id)
        self._session_id = None

    def on_message(self, payload: Union[str, bytes]) -> None:
        # Copied from https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/browser_websocket_handler.py#L148-L189  # noqa: E501

        if not self._session_id:
            return

        try:
            if isinstance(payload, str):
                # Sanity check. (The frontend should only be sending us bytes;
                # Protobuf.ParseFromString does not accept str input.)
                raise RuntimeError(
                    "WebSocket received an unexpected `str` message. "
                    "(We expect `bytes` only.)"
                )

            msg = BackMsg()
            msg.ParseFromString(payload)
            LOGGER.debug("Received the following back message:\n%s", msg)

        except Exception as ex:
            LOGGER.error(ex)
            self._runtime.handle_backmsg_deserialization_exception(self._session_id, ex)
            return

        self._runtime.handle_backmsg(self._session_id, msg)
