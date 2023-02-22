import abc
from typing import Any, Coroutine, NamedTuple, Union


class Request(NamedTuple):
    path: str
    query: str
    headers: dict[str, str]
    body: Union[str, bytes]


class Response(NamedTuple):
    status_code: int
    headers: dict[str, str]
    body: Union[str, bytes]


class RequestHandler(abc.ABC):
    def get(self, request: Request) -> Union[Response, Coroutine[Any, Any, Response]]:
        return Response(status_code=405, headers={}, body="")

    def post(self, request: Request) -> Union[Response, Coroutine[Any, Any, Response]]:
        return Response(status_code=405, headers={}, body="")
