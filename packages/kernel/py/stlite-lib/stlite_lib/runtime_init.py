import logging
import sys
from importlib import resources
from types import ModuleType
from typing import Any


def mock_pyarrow() -> None:
    # Install the pyarrow shim as the fake `pyarrow` module so `import pyarrow`
    # (and its re-imports/sub-imports) resolve to the stub. Used by the
    # server-side runtime (Cloudflare); the browser worker instead registers the
    # same shim with micropip before installing packages, importing
    # _pyarrow_shim.py directly (see worker-runtime.ts).
    # importlib.resources (not Path(__file__)) so the shim is readable when
    # stlite_lib is imported from a zip (the Cloudflare Worker loads it via
    # zipimport).
    source = (resources.files("stlite_lib") / "_pyarrow_shim.py").read_text()
    module = ModuleType("pyarrow")
    exec(source, module.__dict__)
    sys.modules["pyarrow"] = module


def invalidate_import_caches() -> None:
    import importlib

    importlib.invalidate_caches()


def preload_streamlit_runtime() -> None:
    import streamlit.runtime  # noqa: F401


def setup_streamlit_logging_with_callback(
    streamlit_level: str,
    streamlit_message_format: str,
    callback: Any,
) -> None:
    # Browser worker: forward every record to `callback`, which relays it to the
    # main thread's console (the worker has no stderr), where the browser applies
    # its own level filter. Call disable_streamlit_logger_overrides() first to undo
    # Streamlit's own logger setup so these handlers stick.
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_handler = _CallbackLogHandler(callback)
    root_handler.setFormatter(logging.Formatter("%(levelname)s:%(name)s:%(message)s"))
    root_logger.addHandler(root_handler)
    root_logger.setLevel(logging.DEBUG)

    streamlit_logger = logging.getLogger("streamlit")
    streamlit_logger.propagate = False
    streamlit_logger.handlers.clear()
    streamlit_handler = _CallbackLogHandler(callback)
    streamlit_handler.setFormatter(logging.Formatter(streamlit_message_format))
    streamlit_logger.addHandler(streamlit_handler)
    streamlit_logger.setLevel(streamlit_level.upper())


def disable_streamlit_logger_overrides() -> None:
    # Fix Streamlit's logger instantiating strategy, which violates the
    # standard logging API and is problematic for us.
    # See https://github.com/streamlit/streamlit/issues/4742
    import streamlit.logger

    streamlit.logger.get_logger = logging.getLogger
    streamlit.logger.setup_formatter = None
    streamlit.logger.update_formatter = lambda *args, **kwargs: None
    streamlit.logger.set_log_level = lambda *args, **kwargs: None

    for name in streamlit.logger._loggers.keys():
        if name == "root":
            name = "streamlit"
        logger = logging.getLogger(name)
        logger.propagate = True
        logger.handlers.clear()
        logger.setLevel(logging.NOTSET)

    streamlit.logger._loggers = {}


class _CallbackLogHandler(logging.Handler):
    """Forward each record to a JS callback (browser worker → main thread)."""

    def __init__(self, callback: Any) -> None:
        super().__init__()
        self._callback = callback

    def emit(self, record: logging.LogRecord) -> None:
        self._callback(record.levelno, self.format(record))


def disable_runtime_message_cache() -> None:
    # See https://github.com/whitphx/stlite/issues/495
    import streamlit.runtime.runtime

    def is_cacheable_msg(msg: Any) -> bool:
        return False

    setattr(streamlit.runtime.runtime, "is_cacheable_msg", is_cacheable_msg)


def configure_streamlit(
    streamlit_config: dict[str, Any] | None = None,
    multi_runtime: bool = False,
) -> None:
    from stlite_lib.bootstrap import load_config_options

    streamlit_flag_options = {
        # gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
        "browser.gatherUsageStats": False,
        **(streamlit_config or {}),
        # Fast reruns do not work well with the async script runner of stlite.
        # See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
        "runner.fastReruns": False,
    }
    load_config_options(streamlit_flag_options, multi_runtime)


def initialize_streamlit_runtime(
    streamlit_config: dict[str, Any] | None = None,
    *,
    multi_runtime: bool = False,
) -> None:
    mock_pyarrow()
    invalidate_import_caches()
    preload_streamlit_runtime()
    # Cloudflare Worker: neutralize Streamlit's logger overrides but install no
    # handler of our own, so standard logging falls back to Python's default
    # (WARNING+ to stderr via logging.lastResort), which workerd captures into the
    # platform's log pipeline. The browser instead pipes records to the main
    # thread via setup_streamlit_logging_with_callback.
    disable_streamlit_logger_overrides()
    disable_runtime_message_cache()
    configure_streamlit(streamlit_config, multi_runtime=multi_runtime)


__all__ = [
    "configure_streamlit",
    "disable_runtime_message_cache",
    "disable_streamlit_logger_overrides",
    "initialize_streamlit_runtime",
    "invalidate_import_caches",
    "mock_pyarrow",
    "preload_streamlit_runtime",
    "setup_streamlit_logging_with_callback",
]
