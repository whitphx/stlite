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
    home_dir: str


class TaskSpecificDirectoryConfig:
    """
    Ref: `contextlib.chdir`, https://github.com/python/cpython/blob/7e3a5a7e791b742a74c64810f221854191b94c1f/Lib/contextlib.py#L802
    """

    def __init__(self, initial_home_dir: str):
        self.dir_config = DirectoryConfig(
            cwd=initial_home_dir,
            home_dir=initial_home_dir,
        )
        self.old_dir_config: list[DirectoryConfig] = []

    def __enter__(self):
        self.old_dir_config.append(DirectoryConfig(os.getcwd(), os.environ.get("HOME")))

        _LOGGER.debug(
            "Setting task-specific directories: %s -> %s",
            self.old_dir_config,
            self.dir_config,
        )

        os.chdir(self.dir_config.cwd)
        os.environ["HOME"] = self.dir_config.home_dir

    def __exit__(self, *excinfo):
        # Save the current state that may have been updated during the code execution in the context.
        self.dir_config = DirectoryConfig(os.getcwd(), os.environ.get("HOME"))

        _LOGGER.debug(
            "Restoring task-specific directories: %s -> %s",
            self.dir_config,
            self.old_dir_config,
        )

        old = self.old_dir_config.pop()
        os.chdir(old.cwd)
        os.environ["HOME"] = old.home_dir


home_dir_contextvar = ContextVar[str]("home_dir")


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

        home_dir = home_dir_contextvar.get()
        self._directory_context = (
            TaskSpecificDirectoryConfig(home_dir) if home_dir else nullcontext()
        )

    def send(self, value):
        """
        This method is called by the event loop when the task is scheduled to run.
        """
        with self._directory_context:
            try:
                return self.iter.send(value)
            except StopIteration as e:
                # Propagate StopIteration when the coroutine completes
                raise StopIteration(e.value)

    def throw(self, typ, val=None, tb=None):
        """Propagate exceptions into the wrapped coroutine."""
        return self.iter.throw(typ, val, tb)

    def close(self):
        """Close the wrapped coroutine."""
        return self.iter.close()

    def __await__(self):
        """Allow the proxy itself to be awaited."""
        return self

    def __iter__(self):
        return self

    def __next__(self):
        return self.send(None)
