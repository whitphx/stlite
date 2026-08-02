from collections.abc import Awaitable, Callable
from typing import Any

# The ASGI 3.0 interface, shared by the HTTP adapter, the WebSocket bridge, and
# the runtime.
AsgiMessage = dict[str, Any]
AsgiReceive = Callable[[], Awaitable[AsgiMessage]]
AsgiSend = Callable[[AsgiMessage], Awaitable[None]]
AsgiApp = Callable[[dict[str, Any], AsgiReceive, AsgiSend], Awaitable[None]]
