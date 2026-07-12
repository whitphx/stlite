# Copyright (c) Yuichiro Tachibana (Tsuchiya) (2026)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import annotations

import importlib
import logging
import sys
from types import ModuleType
from typing import Any


class _UnsupportedPyArrowType:
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        raise NotImplementedError("stlite does not support this pyarrow type.")


class _UnsupportedPyArrowTable:
    @classmethod
    def from_pandas(cls, *args: Any, **kwargs: Any) -> Any:
        raise NotImplementedError("stlite does not support pyarrow.Table.from_pandas.")


def mock_pyarrow() -> None:
    # Duplicated in packages/kernel/src/mock.ts for the browser worker, which
    # mocks pyarrow before this package is installed. Keep the stubs in sync.
    module = ModuleType("pyarrow")
    setattr(module, "__version__", "0.0.1")
    setattr(module, "Table", _UnsupportedPyArrowTable)
    setattr(module, "Array", _UnsupportedPyArrowType)
    setattr(module, "ChunkedArray", _UnsupportedPyArrowType)
    sys.modules["pyarrow"] = module

    try:
        micropip = importlib.import_module("micropip")
    except ImportError:
        return

    add_mock_package = getattr(micropip, "add_mock_package")
    add_mock_package(
        "pyarrow",
        "0.0.1",
        modules={
            "pyarrow": """
__version__ = '0.0.1'


class Table:
    @classmethod
    def from_pandas(*args, **kwargs):
        raise NotImplementedError("stlite does not support pyarrow.Table.from_pandas.")


class Array:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite does not support this pyarrow type.")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite does not support this pyarrow type.")
"""
        },
    )


def invalidate_import_caches() -> None:
    importlib.invalidate_caches()


def preload_streamlit_runtime() -> None:
    import streamlit.runtime  # noqa: F401


def setup_streamlit_logging(
    streamlit_level: str = "INFO",
    streamlit_message_format: str = "%(asctime)s %(message)s",
    callback: Any | None = None,
) -> None:
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

    root_message_format = "%(levelname)s:%(name)s:%(message)s"

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_formatter = logging.Formatter(root_message_format)
    root_handler = _build_log_handler(callback)
    root_handler.setFormatter(root_formatter)
    root_logger.addHandler(root_handler)
    root_logger.setLevel(logging.DEBUG)

    streamlit_logger = logging.getLogger("streamlit")
    streamlit_logger.propagate = False
    streamlit_logger.handlers.clear()
    streamlit_formatter = logging.Formatter(streamlit_message_format)
    streamlit_handler = _build_log_handler(callback)
    streamlit_handler.setFormatter(streamlit_formatter)
    streamlit_logger.addHandler(streamlit_handler)
    streamlit_logger.setLevel(streamlit_level.upper())


def _build_log_handler(callback: Any | None) -> logging.Handler:
    if callback is None:
        return logging.StreamHandler()

    class CallbackHandler(logging.Handler):
        def emit(self, record: logging.LogRecord) -> None:
            callback(record.levelno, self.format(record))

    return CallbackHandler()


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
    streamlit_log_level: str = "INFO",
    streamlit_log_message_format: str = "%(asctime)s %(message)s",
    log_callback: Any | None = None,
) -> None:
    mock_pyarrow()
    invalidate_import_caches()
    preload_streamlit_runtime()
    setup_streamlit_logging(
        streamlit_log_level,
        streamlit_log_message_format,
        log_callback,
    )
    disable_runtime_message_cache()
    configure_streamlit(streamlit_config, multi_runtime=multi_runtime)


__all__ = [
    "configure_streamlit",
    "disable_runtime_message_cache",
    "initialize_streamlit_runtime",
    "invalidate_import_caches",
    "mock_pyarrow",
    "preload_streamlit_runtime",
    "setup_streamlit_logging",
]
