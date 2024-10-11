import inspect
from typing import Any, Awaitable


async def ensure_awaitable(val: Any | Awaitable[Any]) -> Awaitable[Any]:
    if inspect.isawaitable(val):
        return await val
    return val
