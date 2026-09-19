import asyncio
import contextvars

import pytest

from stlite_lib.pyodide_proxy_context import wrap_create_proxy

var: contextvars.ContextVar[str | None] = contextvars.ContextVar("var", default=None)


def identity_create_proxy(obj, /, **kwargs):
    identity_create_proxy.calls.append(kwargs)
    return obj


identity_create_proxy.calls = []


@pytest.fixture(autouse=True)
def reset_calls():
    identity_create_proxy.calls.clear()
    yield


def call_outside_context(fn, *args):
    # A bare JS entry runs in the thread's root Context; an empty Context stands for it.
    return contextvars.Context().run(fn, *args)


def test_sync_callback_runs_in_the_creation_context():
    create_proxy = wrap_create_proxy(identity_create_proxy)

    def script():
        var.set("from script")
        return create_proxy(lambda: var.get())

    proxy = contextvars.copy_context().run(script)

    assert call_outside_context(proxy) == "from script"


def test_each_call_gets_its_own_copy_of_the_snapshot():
    create_proxy = wrap_create_proxy(identity_create_proxy)

    def callback():
        seen = var.get()
        var.set("changed by callback")
        return seen

    def script():
        var.set("from script")
        return create_proxy(callback)

    proxy = contextvars.copy_context().run(script)

    assert call_outside_context(proxy) == "from script"
    assert call_outside_context(proxy) == "from script"


def test_async_callback_task_inherits_the_creation_context():
    create_proxy = wrap_create_proxy(identity_create_proxy)

    async def callback():
        await asyncio.sleep(0)
        return var.get()

    async def main():
        def script():
            var.set("from script")
            return create_proxy(callback)

        proxy = contextvars.copy_context().run(script)
        # Pyodide awaits whatever the callback returns; here that is the task the
        # wrapper created inside the snapshot.
        task = call_outside_context(proxy)
        assert isinstance(task, asyncio.Task)
        return await task

    assert asyncio.run(main()) == "from script"


def test_non_callables_and_kwargs_pass_through():
    create_proxy = wrap_create_proxy(identity_create_proxy)
    payload = {"a": 1}

    assert create_proxy(payload, roundtrip=False) is payload
    create_proxy(lambda: None, capture_this=True)

    assert identity_create_proxy.calls == [
        {"roundtrip": False},
        {"capture_this": True},
    ]
