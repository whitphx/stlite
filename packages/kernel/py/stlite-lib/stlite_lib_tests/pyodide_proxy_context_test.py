import asyncio
import contextvars

import pytest

from stlite_lib.pyodide_proxy_context import wrap_proxy_factory

var: contextvars.ContextVar[str | None] = contextvars.ContextVar("var", default=None)


@pytest.fixture
def factory():
    """Stands in for ``create_proxy``: records its kwargs and hands back the callable."""
    calls: list[dict] = []

    def identity_factory(obj, /, **kwargs):
        calls.append(kwargs)
        return obj

    identity_factory.calls = calls
    return wrap_proxy_factory(identity_factory)


def run_outside_context(fn, *args):
    # A bare JS entry runs in the thread's root Context; an empty Context stands for it.
    return contextvars.Context().run(fn, *args)


def make_in_script(factory, callback):
    def script():
        var.set("from script")
        return factory(callback)

    return contextvars.copy_context().run(script)


def test_sync_callback_runs_in_the_creation_context(factory):
    proxy = make_in_script(factory, lambda: var.get())

    assert run_outside_context(proxy) == "from script"


def test_each_call_gets_its_own_copy_of_the_snapshot(factory):
    def callback():
        seen = var.get()
        var.set("changed by callback")
        return seen

    proxy = make_in_script(factory, callback)

    assert run_outside_context(proxy) == "from script"
    assert run_outside_context(proxy) == "from script"


def test_callback_can_be_reentered_from_inside_itself(factory):
    proxy = None

    def callback(depth):
        if depth == 0:
            return [var.get()]
        return [var.get(), *proxy(depth - 1)]

    proxy = make_in_script(factory, callback)

    assert run_outside_context(proxy, 2) == ["from script"] * 3


def test_async_callback_task_inherits_the_creation_context(factory):
    async def callback():
        await asyncio.sleep(0)
        return var.get()

    async def main():
        proxy = make_in_script(factory, callback)
        # Pyodide awaits whatever the callback returns; here that is the task the
        # wrapper created inside the snapshot.
        task = run_outside_context(proxy)
        assert isinstance(task, asyncio.Task)
        return await task

    assert asyncio.run(main()) == "from script"


def test_callable_object_keeps_its_attributes(factory):
    class Handler:
        calls = 0

        def __call__(self):
            self.calls += 1
            return var.get()

        def reset(self):
            self.calls = 0

    handler = Handler()
    proxy = make_in_script(factory, handler)

    assert run_outside_context(proxy) == "from script"
    assert proxy.calls == 1
    proxy.reset()
    assert handler.calls == 0


def test_non_callables_and_kwargs_pass_through(factory):
    payload = {"a": 1}

    assert factory(payload, roundtrip=False) is payload
    factory(lambda: None, capture_this=True)

    assert factory.__wrapped__.calls == [{"roundtrip": False}, {"capture_this": True}]
