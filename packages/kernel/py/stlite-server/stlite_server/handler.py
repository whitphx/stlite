import abc
from typing import Tuple, Union, NamedTuple


class Request(NamedTuple):
    path: str
    headers: dict
    body: Union[str, bytes]


class RequestHandler(abc.ABC):
    @abc.abstractmethod
    async def get(self, request: Request, *args) -> Tuple[int, dict, bytes]:
        ...
