"""A pure-Python Arrow IPC stream writer.

Serializes pandas DataFrames to the Arrow IPC streaming format with the same
types and "pandas" schema metadata as `pyarrow.Table.from_pandas`, for
runtimes where pyarrow itself is unavailable.
"""

__version__ = "0.1.0"

from .errors import (  # noqa: E402
    ArrowCapacityError,
    ArrowException,
    ArrowInvalid,
    ArrowNotImplementedError,
    ArrowTypeError,
)
from .table import Schema, Table  # noqa: E402

__all__ = [
    "ArrowCapacityError",
    "ArrowException",
    "ArrowInvalid",
    "ArrowNotImplementedError",
    "ArrowTypeError",
    "Schema",
    "Table",
    "dataframe_to_ipc",
    "table_from_pandas",
    "write_stream",
]


def table_from_pandas(df, preserve_index=None):  # type: ignore[no-untyped-def]
    """The Table `pyarrow.Table.from_pandas(df, preserve_index)` would build."""
    from .pandas_compat import table_from_pandas as _table_from_pandas

    return _table_from_pandas(df, preserve_index=preserve_index)


def write_stream(table: Table) -> bytes:
    """Serializes `table` in the Arrow IPC streaming format."""
    from .ipc import write_stream as _write_stream

    return _write_stream(table)


def dataframe_to_ipc(df, preserve_index=None) -> bytes:  # type: ignore[no-untyped-def]
    """`df` as an Arrow IPC stream, as pyarrow would write it."""
    return write_stream(table_from_pandas(df, preserve_index=preserve_index))
