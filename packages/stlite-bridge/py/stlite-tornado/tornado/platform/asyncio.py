import asyncio
import concurrent.futures
import functools
import sys
import threading
from tornado.gen import convert_yielded
from tornado.ioloop import IOLoop, _Selectable

from typing import Any, TypeVar, Awaitable, Callable, Union, Optional, List, Tuple, Dict

_T = TypeVar("_T")


if sys.version_info >= (3, 10):

    def _get_event_loop() -> asyncio.AbstractEventLoop:
        try:
            return asyncio.get_running_loop()
        except RuntimeError:
            pass

        return asyncio.get_event_loop_policy().get_event_loop()


else:
    from asyncio import get_event_loop as _get_event_loop


class BaseAsyncIOLoop(IOLoop):
    def initialize(  # type: ignore
        self, asyncio_loop: asyncio.AbstractEventLoop, **kwargs: Any
    ) -> None:
        # asyncio_loop is always the real underlying IOLoop. This is used in
        # ioloop.py to maintain the asyncio-to-ioloop mappings.
        self.asyncio_loop = asyncio_loop
        # selector_loop is an event loop that implements the add_reader family of
        # methods. Usually the same as asyncio_loop but differs on platforms such
        # as windows where the default event loop does not implement these methods.
        self.selector_loop = asyncio_loop
        if hasattr(asyncio, "ProactorEventLoop") and isinstance(
            asyncio_loop, asyncio.ProactorEventLoop  # type: ignore
        ):
            # Ignore this line for mypy because the abstract method checker
            # doesn't understand dynamic proxies.
            self.selector_loop = AddThreadSelectorEventLoop(asyncio_loop)  # type: ignore
        # Maps fd to (fileobj, handler function) pair (as in IOLoop.add_handler)
        self.handlers = {}  # type: Dict[int, Tuple[Union[int, _Selectable], Callable]]
        # Set of fds listening for reads/writes
        self.readers = set()  # type: Set[int]
        self.writers = set()  # type: Set[int]
        self.closing = False
        # If an asyncio loop was closed through an asyncio interface
        # instead of IOLoop.close(), we'd never hear about it and may
        # have left a dangling reference in our map. In case an
        # application (or, more likely, a test suite) creates and
        # destroys a lot of event loops in this way, check here to
        # ensure that we don't have a lot of dead loops building up in
        # the map.
        #
        # TODO(bdarnell): consider making self.asyncio_loop a weakref
        # for AsyncIOMainLoop and make _ioloop_for_asyncio a
        # WeakKeyDictionary.
        for loop in IOLoop._ioloop_for_asyncio.copy():
            if loop.is_closed():
                try:
                    del IOLoop._ioloop_for_asyncio[loop]
                except KeyError:
                    pass
        IOLoop._ioloop_for_asyncio[asyncio_loop] = self

        self._thread_identity = 0

        super().initialize(**kwargs)

        def assign_thread_identity() -> None:
            self._thread_identity = threading.get_ident()

        self.add_callback(assign_thread_identity)

    def close(self, all_fds: bool = False) -> None:
        self.closing = True
        for fd in list(self.handlers):
            fileobj, handler_func = self.handlers[fd]
            self.remove_handler(fd)
            if all_fds:
                self.close_fd(fileobj)
        # Remove the mapping before closing the asyncio loop. If this
        # happened in the other order, we could race against another
        # initialize() call which would see the closed asyncio loop,
        # assume it was closed from the asyncio side, and do this
        # cleanup for us, leading to a KeyError.
        del IOLoop._ioloop_for_asyncio[self.asyncio_loop]
        if self.selector_loop is not self.asyncio_loop:
            self.selector_loop.close()
        self.asyncio_loop.close()

    def add_handler(
        self, fd: Union[int, _Selectable], handler: Callable[..., None], events: int
    ) -> None:
        fd, fileobj = self.split_fd(fd)
        if fd in self.handlers:
            raise ValueError("fd %s added twice" % fd)
        self.handlers[fd] = (fileobj, handler)
        if events & IOLoop.READ:
            self.selector_loop.add_reader(fd, self._handle_events, fd, IOLoop.READ)
            self.readers.add(fd)
        if events & IOLoop.WRITE:
            self.selector_loop.add_writer(fd, self._handle_events, fd, IOLoop.WRITE)
            self.writers.add(fd)

    def update_handler(self, fd: Union[int, _Selectable], events: int) -> None:
        fd, fileobj = self.split_fd(fd)
        if events & IOLoop.READ:
            if fd not in self.readers:
                self.selector_loop.add_reader(fd, self._handle_events, fd, IOLoop.READ)
                self.readers.add(fd)
        else:
            if fd in self.readers:
                self.selector_loop.remove_reader(fd)
                self.readers.remove(fd)
        if events & IOLoop.WRITE:
            if fd not in self.writers:
                self.selector_loop.add_writer(fd, self._handle_events, fd, IOLoop.WRITE)
                self.writers.add(fd)
        else:
            if fd in self.writers:
                self.selector_loop.remove_writer(fd)
                self.writers.remove(fd)

    def remove_handler(self, fd: Union[int, _Selectable]) -> None:
        fd, fileobj = self.split_fd(fd)
        if fd not in self.handlers:
            return
        if fd in self.readers:
            self.selector_loop.remove_reader(fd)
            self.readers.remove(fd)
        if fd in self.writers:
            self.selector_loop.remove_writer(fd)
            self.writers.remove(fd)
        del self.handlers[fd]

    def _handle_events(self, fd: int, events: int) -> None:
        fileobj, handler_func = self.handlers[fd]
        handler_func(fileobj, events)

    def start(self) -> None:
        try:
            old_loop = _get_event_loop()
        except (RuntimeError, AssertionError):
            old_loop = None  # type: ignore
        try:
            asyncio.set_event_loop(self.asyncio_loop)
            self.asyncio_loop.run_forever()
        finally:
            asyncio.set_event_loop(old_loop)

    def stop(self) -> None:
        self.asyncio_loop.stop()

    def call_at(
        self, when: float, callback: Callable, *args: Any, **kwargs: Any
    ) -> object:
        # asyncio.call_at supports *args but not **kwargs, so bind them here.
        # We do not synchronize self.time and asyncio_loop.time, so
        # convert from absolute to relative.
        return self.asyncio_loop.call_later(
            max(0, when - self.time()),
            self._run_callback,
            functools.partial(callback, *args, **kwargs),
        )

    def remove_timeout(self, timeout: object) -> None:
        timeout.cancel()  # type: ignore

    def add_callback(self, callback: Callable, *args: Any, **kwargs: Any) -> None:
        if threading.get_ident() == self._thread_identity:
            call_soon = self.asyncio_loop.call_soon
        else:
            call_soon = self.asyncio_loop.call_soon_threadsafe
        try:
            call_soon(self._run_callback, functools.partial(callback, *args, **kwargs))
        except RuntimeError:
            # "Event loop is closed". Swallow the exception for
            # consistency with PollIOLoop (and logical consistency
            # with the fact that we can't guarantee that an
            # add_callback that completes without error will
            # eventually execute).
            pass
        except AttributeError:
            # ProactorEventLoop may raise this instead of RuntimeError
            # if call_soon_threadsafe races with a call to close().
            # Swallow it too for consistency.
            pass

    def add_callback_from_signal(
        self, callback: Callable, *args: Any, **kwargs: Any
    ) -> None:
        try:
            self.asyncio_loop.call_soon_threadsafe(
                self._run_callback, functools.partial(callback, *args, **kwargs)
            )
        except RuntimeError:
            pass

    def run_in_executor(
        self,
        executor: Optional[concurrent.futures.Executor],
        func: Callable[..., _T],
        *args: Any
    ) -> Awaitable[_T]:
        return self.asyncio_loop.run_in_executor(executor, func, *args)

    def set_default_executor(self, executor: concurrent.futures.Executor) -> None:
        return self.asyncio_loop.set_default_executor(executor)


class AsyncIOMainLoop(BaseAsyncIOLoop):
    """``AsyncIOMainLoop`` creates an `.IOLoop` that corresponds to the
    current ``asyncio`` event loop (i.e. the one returned by
    ``asyncio.get_event_loop()``).

    .. deprecated:: 5.0

       Now used automatically when appropriate; it is no longer necessary
       to refer to this class directly.

    .. versionchanged:: 5.0

       Closing an `AsyncIOMainLoop` now closes the underlying asyncio loop.
    """

    def initialize(self, **kwargs: Any) -> None:  # type: ignore
        super().initialize(asyncio.get_event_loop(), **kwargs)

    def make_current(self) -> None:
        # AsyncIOMainLoop already refers to the current asyncio loop so
        # nothing to do here.
        pass
