import asyncio

import pytest

from stlite_lib.asgi_app import run_lifespan_shutdown, run_lifespan_startup


async def _drain_startup(receive):
    message = await receive()
    assert message["type"] == "lifespan.startup"


def test_successful_startup_returns_state_and_shutdown_works():
    async def app(scope, receive, send):
        await _drain_startup(receive)
        await send({"type": "lifespan.startup.complete"})
        message = await receive()
        assert message["type"] == "lifespan.shutdown"
        await send({"type": "lifespan.shutdown.complete"})

    async def scenario():
        state = await run_lifespan_startup(app)
        assert not state["_lifespan_task"].done()
        await run_lifespan_shutdown(state)
        assert state["_lifespan_task"].done()

    asyncio.run(scenario())


def test_startup_failed_before_yielding_raises_and_cleans_up():
    async def app(scope, receive, send):
        await _drain_startup(receive)
        await send({"type": "lifespan.startup.failed", "message": "boom"})

    async def scenario():
        with pytest.raises(RuntimeError, match="startup failed: boom"):
            await run_lifespan_startup(app)

    asyncio.run(scenario())


def test_startup_failed_after_yielding_control_raises():
    async def app(scope, receive, send):
        await _drain_startup(receive)
        # Yield control a few times before reporting the failure, so the
        # failure arrives while the caller is already awaiting the events.
        for _ in range(3):
            await asyncio.sleep(0)
        await send({"type": "lifespan.startup.failed", "message": "late boom"})

    async def scenario():
        with pytest.raises(RuntimeError, match="late boom"):
            await run_lifespan_startup(app)

    asyncio.run(scenario())


def test_starlette_style_failure_chains_the_original_exception():
    # Starlette sends startup.failed and then re-raises the original
    # exception inside the lifespan task; that exception must survive as the
    # cause of the reported failure, and the task must be finished.
    async def app(scope, receive, send):
        await _drain_startup(receive)
        await send({"type": "lifespan.startup.failed", "message": "original"})
        raise ValueError("the real startup error")

    async def scenario():
        with pytest.raises(RuntimeError, match="original") as excinfo:
            await run_lifespan_startup(app)
        assert isinstance(excinfo.value.__cause__, ValueError)

    asyncio.run(scenario())


def test_lifespan_crash_before_reporting_propagates():
    async def app(scope, receive, send):
        await _drain_startup(receive)
        raise ValueError("crashed before reporting")

    async def scenario():
        with pytest.raises(ValueError, match="crashed before reporting"):
            await run_lifespan_startup(app)

    asyncio.run(scenario())


def test_lifespan_exiting_without_reporting_raises():
    async def app(scope, receive, send):
        await _drain_startup(receive)

    async def scenario():
        with pytest.raises(RuntimeError, match="before reporting startup"):
            await run_lifespan_startup(app)

    asyncio.run(scenario())


def test_failure_leaves_no_pending_lifespan_task():
    # A failed startup must not leak a suspended lifespan task: retrying the
    # startup (as Cloudflare's single-flight init does after discarding a
    # failed attempt) must be able to run cleanly in the same loop.
    started = 0

    async def app(scope, receive, send):
        nonlocal started
        started += 1
        await _drain_startup(receive)
        if started == 1:
            await send({"type": "lifespan.startup.failed", "message": "first"})
            return
        await send({"type": "lifespan.startup.complete"})
        # Stay resident until shutdown, like a real lifespan.
        await receive()

    async def scenario():
        with pytest.raises(RuntimeError, match="first"):
            await run_lifespan_startup(app)
        remaining = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
        assert remaining == []
        state = await run_lifespan_startup(app)
        assert not state["_lifespan_task"].done()
        state["_shutdown_event"].set()

    asyncio.run(scenario())
    assert started == 2
