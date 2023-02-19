import abc
from typing import NamedTuple, Tuple, Union


class Request(NamedTuple):
    path: str
    headers: dict
    body: Union[str, bytes]


class RequestHandler(abc.ABC):
    async def get(self, request: Request, *args) -> Tuple[int, dict, bytes]:
        return 405, {}, b""

    async def post(self, request: Request, *args) -> Tuple[int, dict, bytes]:
        return 405, {}, b""
