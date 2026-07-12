from __future__ import annotations

import asyncio

import pytest

from stlite_cloudflare import runtime


@pytest.fixture(autouse=True)
def reset_init_task():
    runtime._init_task = None
    yield
    runtime._init_task = None


@pytest.mark.asyncio
async def test_concurrent_requests_share_one_initialization(monkeypatch):
    calls = 0
    release = asyncio.Event()

    async def fake_create():
        nonlocal calls
        calls += 1
        await release.wait()
        return "app"

    monkeypatch.setattr(runtime, "_create_streamlit_asgi_app", fake_create)

    tasks = [
        asyncio.ensure_future(runtime.get_streamlit_asgi_app()) for _ in range(3)
    ]
    await asyncio.sleep(0)
    release.set()

    assert await asyncio.gather(*tasks) == ["app", "app", "app"]
    assert calls == 1


@pytest.mark.asyncio
async def test_failed_initialization_is_retried(monkeypatch):
    calls = 0

    async def flaky_create():
        nonlocal calls
        calls += 1
        if calls == 1:
            raise RuntimeError("transient cold-start failure")
        return "app"

    monkeypatch.setattr(runtime, "_create_streamlit_asgi_app", flaky_create)

    with pytest.raises(RuntimeError, match="transient cold-start failure"):
        await runtime.get_streamlit_asgi_app()

    assert await runtime.get_streamlit_asgi_app() == "app"
    assert calls == 2
