import logging
import os
from contextvars import ContextVar

_LOGGER = logging.getLogger(__name__)

home_dir_contextvar = ContextVar("home_dir")


class TaskSpecificHomeDirectory:
    """Async context manager for task-specific home directory."""

    def __init__(self):
        self.original_dir = None

    async def __aenter__(self):
        dir_path = home_dir_contextvar.get(None)
        _LOGGER.debug("Setting task-specific home directory: %s", dir_path)
        if dir_path is not None:
            self.original_dir = os.getcwd()
            os.chdir(dir_path)
            os.environ["HOME"] = dir_path

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        _LOGGER.debug("Restoring original home directory: %s", self.original_dir)
        if self.original_dir is not None:
            os.chdir(self.original_dir)
            os.environ["HOME"] = self.original_dir
