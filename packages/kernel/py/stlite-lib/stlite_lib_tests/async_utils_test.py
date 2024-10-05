import pytest

from stlite_lib.async_utils import ensure_awaitable


@pytest.mark.asyncio
async def test_with_awaitable():
    async def foo():
        return 42

    assert await ensure_awaitable(foo()) == 42


@pytest.mark.asyncio
async def test_with_not_awaitable():
    def foo():
        return 42

    assert await ensure_awaitable(foo()) == 42
