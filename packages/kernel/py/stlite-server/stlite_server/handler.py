import abc
from typing import Any, Coroutine, Dict, NamedTuple, Tuple, Union


class Request(NamedTuple):
    path: str
    headers: dict
    body: Union[str, bytes]


HandlerReturnType = Tuple[int, Dict[str, str], bytes]


class RequestHandler(abc.ABC):
    def get(
        self, request: Request
    ) -> Union[HandlerReturnType, Coroutine[Any, Any, HandlerReturnType]]:
        return 405, {}, b""

    def post(
        self, request: Request
    ) -> Union[HandlerReturnType, Coroutine[Any, Any, HandlerReturnType]]:
        return 405, {}, b""
