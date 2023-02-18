import logging
from typing import Callable, Dict, Final, Optional, Union

import pyodide
from streamlit import config, file_util, source_util, util
from streamlit.components.v1.components import ComponentRegistry
from streamlit.config_option import ConfigOption
from streamlit.proto.BackMsg_pb2 import BackMsg
from streamlit.proto.ForwardMsg_pb2 import ForwardMsg
from streamlit.runtime import Runtime, RuntimeConfig, RuntimeState, SessionClient
from streamlit.runtime.memory_media_file_storage import MemoryMediaFileStorage
from streamlit.runtime.runtime_util import serialize_forward_msg
from streamlit.runtime.runtime_util import get_max_message_size_bytes

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

        # TODO: Initialize paths
        self._websocket_handler = WebSocketHandler(self._runtime)

        await self._runtime.start()

    def start_websocket(self, path: str, on_message):
        self._websocket_handler.open(on_message)

    def receive_websocket(self, message: bytes):
        self._websocket_handler.on_message(message)

    def receive_websocket_from_js(self, payload_from_js: pyodide.ffi.JsProxy):
        payload = payload_from_js.to_bytes()

        if not isinstance(payload, bytes):
            LOGGER.warning("The WebSocket payload is not of type bytes, but %s", type(payload))
            return

        self.receive_websocket(payload)

    def stop(self):
        self._websocket_handler.on_close()


class WebSocketHandler(SessionClient):
    """ This class is a replacement for the class of the same name in streamlit.web.server.browser_websocket_handler.py.
    The implementation is based on the original WebSocketHandler in https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/browser_websocket_handler.py.
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
        """ Copied from https://github.com/streamlit/streamlit/blob/1.18.1/lib/streamlit/web/server/browser_websocket_handler.py#L148-L189 """

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

        # "debug_disconnect_websocket" and "debug_shutdown_runtime" are special
        # developmentMode-only messages used in e2e tests to test reconnect handling and
        # disabling widgets.
        if msg.WhichOneof("type") == "debug_disconnect_websocket":
            if config.get_option("global.developmentMode"):
                self.close()
            else:
                LOGGER.warning(
                    "Client tried to disconnect websocket when not in development mode."
                )
        elif msg.WhichOneof("type") == "debug_shutdown_runtime":
            if config.get_option("global.developmentMode"):
                self._runtime.stop()
            else:
                LOGGER.warning(
                    "Client tried to shut down runtime when not in development mode."
                )
        else:
            # AppSession handles all other BackMsg types.
            self._runtime.handle_backmsg(self._session_id, msg)
