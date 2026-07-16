from __future__ import annotations

import asyncio
import gc
import sys
import types

import pytest

from stlite_cloudflare import runtime


@pytest.fixture(autouse=True)
def reset_init_task():
    runtime._init_task = None
    runtime._lifespan_state = None
    yield
    runtime._init_task = None
    runtime._lifespan_state = None


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

    tasks = [asyncio.ensure_future(runtime.get_streamlit_asgi_app()) for _ in range(3)]
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


def _install_fake_stlite_lib(monkeypatch, *, run_lifespan_startup):
    asgi_app = types.ModuleType("stlite_lib.asgi_app")
    asgi_app.create_app = lambda script_path: object()
    asgi_app.make_call_asgi = lambda app, home_dir: lambda scope, receive, send: None
    asgi_app.bind_runtime_to_current_context = lambda app: None
    asgi_app.run_lifespan_startup = run_lifespan_startup

    bootstrap = types.ModuleType("stlite_lib.bootstrap")
    bootstrap.prepare = lambda script_path, args: None

    runtime_init = types.ModuleType("stlite_lib.runtime_init")
    runtime_init.initialize_streamlit_runtime = lambda config: None

    stlite_lib = types.ModuleType("stlite_lib")
    stlite_lib.asgi_app = asgi_app
    stlite_lib.bootstrap = bootstrap
    stlite_lib.runtime_init = runtime_init

    for name, module in {
        "stlite_lib": stlite_lib,
        "stlite_lib.asgi_app": asgi_app,
        "stlite_lib.bootstrap": bootstrap,
        "stlite_lib.runtime_init": runtime_init,
    }.items():
        monkeypatch.setitem(sys.modules, name, module)


@pytest.mark.asyncio
async def test_initialization_retains_the_lifespan_state(monkeypatch, tmp_path):
    # The lifespan handshake state holds the suspended task that keeps
    # Streamlit's runtime context open, and asyncio only *weakly* references
    # tasks. If the returned state is dropped instead of held, GC reaps the
    # lifespan task, the runtime tears down, and session WebSockets receive
    # BackMsgs with no runtime left to answer them (the app renders nothing).
    handed_out = {}

    async def fake_run_lifespan_startup(app):
        state = {"_lifespan_task": object(), "_shutdown_event": object()}
        handed_out["state"] = state
        return state

    _install_fake_stlite_lib(
        monkeypatch, run_lifespan_startup=fake_run_lifespan_startup
    )

    app_pkg = types.ModuleType("_stlite_cloudflare_app")
    app_pkg.__file__ = str(tmp_path / "__init__.py")
    monkeypatch.setitem(sys.modules, "_stlite_cloudflare_app", app_pkg)

    await runtime._create_streamlit_asgi_app()

    # A strong reference to the exact state must survive garbage collection.
    gc.collect()
    assert runtime._lifespan_state is handed_out["state"]
