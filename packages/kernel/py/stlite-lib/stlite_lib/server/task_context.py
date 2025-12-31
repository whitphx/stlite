import logging
import os
from collections.abc import Coroutine
from contextlib import nullcontext
from contextvars import ContextVar
from dataclasses import dataclass

_LOGGER = logging.getLogger(__name__)


@dataclass
class DirectoryConfig:
    cwd: str
    home_dir: str | None


class TaskSpecificDirectoryConfig:
    def __init__(self, initial_home_dir: str):
        self.context_dir_config = DirectoryConfig(
            cwd=initial_home_dir,
            home_dir=initial_home_dir,
        )
        # Use `list` here inspired by the implementation of `contextlib.chdir`, https://github.com/python/cpython/blob/7e3a5a7e791b742a74c64810f221854191b94c1f/Lib/contextlib.py#L807
        self.old_dir_config: list[DirectoryConfig] = []

    def __enter__(self):
        current = DirectoryConfig(os.getcwd(), os.environ.get("HOME"))
        self.old_dir_config.append(current)

        _LOGGER.debug(
            "Setting task-specific directories: %s -> %s",
            current,
            self.context_dir_config,
        )

        self._apply_config(self.context_dir_config)

    def __exit__(self, *excinfo):
        # Save the current state that may have been updated during the code execution in the context.
        self.context_dir_config = DirectoryConfig(os.getcwd(), os.environ.get("HOME"))
        restored = self.old_dir_config.pop()

        _LOGGER.debug(
            "Restoring task-specific directories: %s -> %s",
            self.context_dir_config,
            restored,
        )

        self._apply_config(restored)

    def _apply_config(self, config: DirectoryConfig):
        os.chdir(config.cwd)
        if config.home_dir is not None:
            os.environ["HOME"] = config.home_dir
        else:
            os.environ.pop("HOME", None)


home_dir_contextvar: ContextVar[str | None] = ContextVar("home_dir", default=None)


class DirectorySyncCoroutineProxy(Coroutine):
    """
    A transparent Coroutine proxy that hooks into the execution steps of a coroutine
    to set the current working directory and the environment variable 'HOME' to a task-specific value
    before every execution step.
    """

    def __init__(self, coro: Coroutine):
        self.coro = coro
        # Extract the underlying iterator/generator
        self.iter = coro.__await__()

        home_dir = home_dir_contextvar.get(None)
        self._directory_context = (
            TaskSpecificDirectoryConfig(home_dir) if home_dir else nullcontext()
        )

    def send(self, value):
        """
        This method is called by the event loop when the task is scheduled to run.
        """
        with self._directory_context:
            return self.iter.send(value)

    def throw(self, typ, val=None, tb=None):
        """Propagate exceptions into the wrapped coroutine."""
        with self._directory_context:
            return self.iter.throw(typ, val, tb)

    def close(self):
        """Close the wrapped coroutine."""
        with self._directory_context:
            return self.iter.close()

    def __await__(self):
        """Allow the proxy itself to be awaited."""
        return self

    def __iter__(self):
        return self

    def __next__(self):
        """
        Implement the iterator protocol by delegating to send(None).

        When the coroutine completes, send() will raise StopIteration with the
        return value, which is the expected behavior for the iterator protocol
        and will propagate naturally to signal completion.
        """
        return self.send(None)
