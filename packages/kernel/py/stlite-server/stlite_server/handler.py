import abc
from typing import Awaitable, NamedTuple


class Request(NamedTuple):
    path: str
    query: str
    headers: dict[str, str]
    body: str | bytes


class Response(NamedTuple):
    status_code: int
    headers: dict[str, str]
    body: str | bytes


class RequestHandler(abc.ABC):
    def get(self, request: Request) -> Response | Awaitable[Response]:
        return Response(status_code=405, headers={}, body="")

    def put(self, request: Request) -> Response | Awaitable[Response]:
        return Response(status_code=405, headers={}, body="")

    def delete(self, request: Request) -> Response | Awaitable[Response]:
        return Response(status_code=405, headers={}, body="")
