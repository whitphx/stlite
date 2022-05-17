import concurrent.futures
from functools import singledispatch
from inspect import isawaitable

from tornado.concurrent import (
    Future,
    is_future,
)

import typing
from typing import Union, Any, List, Awaitable, Dict

_T = typing.TypeVar("_T")

_Yieldable = Union[
    None, Awaitable, List[Awaitable], Dict[Any, Awaitable], concurrent.futures.Future
]


class KeyReuseError(Exception):
    pass


class UnknownKeyError(Exception):
    pass


class LeakedCallbackError(Exception):
    pass


class BadYieldError(Exception):
    pass


class ReturnValueIgnoredError(Exception):
    pass



class _NullFuture(object):
    """_NullFuture resembles a Future that finished with a result of None.

    It's not actually a `Future` to avoid depending on a particular event loop.
    Handled as a special case in the coroutine runner.

    We lie and tell the type checker that a _NullFuture is a Future so
    we don't have to leak _NullFuture into lots of public APIs. But
    this means that the type checker can't warn us when we're passing
    a _NullFuture into a code path that doesn't understand what to do
    with it.
    """

    def result(self) -> None:
        return None

    def done(self) -> bool:
        return True


# _null_future is used as a dummy value in the coroutine runner. It differs
# from moment in that moment always adds a delay of one IOLoop iteration
# while _null_future is processed as soon as possible.
_null_future = typing.cast(Future, _NullFuture())

moment = typing.cast(Future, _NullFuture())
moment.__doc__ = """A special object which may be yielded to allow the IOLoop to run for
one iteration.

This is not needed in normal use but it can be helpful in long-running
coroutines that are likely to yield Futures that are ready instantly.

Usage: ``yield gen.moment``

In native coroutines, the equivalent of ``yield gen.moment`` is
``await asyncio.sleep(0)``.

.. versionadded:: 4.0

.. deprecated:: 4.5
   ``yield None`` (or ``yield`` with no argument) is now equivalent to
    ``yield gen.moment``.
"""


def coroutine(fn):
    return fn


def convert_yielded(yielded: _Yieldable) -> Future:
    """Convert a yielded object into a `.Future`.

    The default implementation accepts lists, dictionaries, and
    Futures. This has the side effect of starting any coroutines that
    did not start themselves, similar to `asyncio.ensure_future`.

    If the `~functools.singledispatch` library is available, this function
    may be extended to support additional types. For example::

        @convert_yielded.register(asyncio.Future)
        def _(asyncio_future):
            return tornado.platform.asyncio.to_tornado_future(asyncio_future)

    .. versionadded:: 4.1

    """
    if yielded is None or yielded is moment:
        return moment
    elif yielded is _null_future:
        return _null_future
    elif isinstance(yielded, (list, dict)):
        return multi(yielded)  # type: ignore
    elif is_future(yielded):
        return typing.cast(Future, yielded)
    elif isawaitable(yielded):
        return _wrap_awaitable(yielded)  # type: ignore
    else:
        raise BadYieldError("yielded unknown object %r" % (yielded,))


convert_yielded = singledispatch(convert_yielded)
