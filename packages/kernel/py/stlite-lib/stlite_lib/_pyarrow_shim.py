# The pyarrow stand-in for Stlite runtimes that ship without pyarrow, which is
# @stlite/cloudflare: Pyodide's pyarrow wasm build is ~43 MiB unpacked, beyond
# the Worker script limit, and loading it takes ~48 MiB of wasm memory out of
# the isolate's 128 MB. The browser runtime installs the real pyarrow instead.
#
# mock_pyarrow() (runtime_init.py) reads this file's source and installs it as
# `sys.modules["pyarrow"]`, with its `compute` and `types` namespaces as
# `pyarrow.compute` and `pyarrow.types`, so it must stay self-contained (no
# stlite_lib imports).
#
# It covers the part of pyarrow's API that Streamlit uses to send dataframes to
# the frontend, and hands the work to arrow_ipc_writer, a pure-Python writer
# that produces what pyarrow would:
# - `Table.from_pandas`, and the schema and `pyarrow.types` checks Streamlit
#   makes on the result to configure columns;
# - `RecordBatchStreamWriter` into a `BufferOutputStream`, which serializes it;
# - `Table.slice`, `Table.take` and `pyarrow.compute.sort_indices`, with which
#   Streamlit serves large dataframes in sorted chunks;
# - `pyarrow.array`, with which it checks whether a column converts.
# Anything else raises `PyarrowUnavailableError`, an `AttributeError` subclass
# so that `hasattr()` and `getattr(pyarrow, name, default)` keep their usual
# meaning. So does all of the above when arrow_ipc_writer isn't installed,
# which `--mock pandas` (or `--slim`) builds remove along with pandas.
#
# `Table` and `Array` are defined here rather than in arrow_ipc_writer, so the
# `isinstance(data, pyarrow.Table)` checks Streamlit's data-format detection
# makes for non-dataframe elements too don't import the writer, and numpy with
# it.

import json as _json
from types import ModuleType as _ModuleType
from typing import Any as _Any

# pandas reads this to decide whether pyarrow is usable, and a version this old
# keeps it on its pyarrow-free code paths: pandas' own pyarrow integration
# needs the real thing. Streamlit's Arrow PyCapsule path (pyarrow >= 15) stays
# off for the same reason.
__version__ = "0.0.1"

# Lets Stlite tell this stand-in from the real pyarrow (see
# bootstrap._fix_altair).
__stlite_stub__ = True

_UNAVAILABLE_MESSAGE = (
    "This Stlite runtime ships without pyarrow: @stlite/cloudflare omits it "
    "because it exceeds the Cloudflare Workers script size and memory limits."
)

_NO_WRITER_MESSAGE = (
    "This Stlite runtime ships without pyarrow, and without the pure-Python "
    "Arrow writer that stands in for it, which is removed along with pandas "
    "(by `--mock pandas` or `--slim`), so elements that send data through "
    "Arrow are unavailable: st.dataframe, st.data_editor, st.table, st.write "
    "with a dataframe, and charts such as st.line_chart, st.bar_chart and "
    "st.altair_chart."
)


class PyarrowUnavailableError(AttributeError):
    pass


def _unavailable(name):
    return PyarrowUnavailableError(
        f"pyarrow.{name} is unavailable. {_UNAVAILABLE_MESSAGE} Its stand-in "
        "covers only the part of pyarrow's API that Streamlit uses to send "
        "dataframes to the frontend."
    )


def _writer():
    try:
        import arrow_ipc_writer
        import arrow_ipc_writer.compute
        import arrow_ipc_writer.convert
        import arrow_ipc_writer.types
    except ImportError as e:
        raise PyarrowUnavailableError(_NO_WRITER_MESSAGE) from e
    return arrow_ipc_writer


_ERROR_NAMES = (
    "ArrowException",
    "ArrowInvalid",
    "ArrowTypeError",
    "ArrowNotImplementedError",
    "ArrowCapacityError",
)


def __getattr__(name):
    if name.startswith("__") and name.endswith("__"):
        # Import machinery and introspection probe dunders such as `__path__`;
        # report them missing the ordinary way.
        raise AttributeError(name)
    if name in _ERROR_NAMES:
        # The writer's own classes, so that what it raises is what Streamlit
        # catches.
        return getattr(_writer(), name)
    raise _unavailable(name)


def _missing_attribute(owner, name):
    if name.startswith("__") and name.endswith("__"):
        return AttributeError(name)
    return _unavailable(f"{owner}.{name}")


class Schema:
    # The arrow_ipc_writer schema this wraps, and the writer table it is the
    # schema of, if any.
    _schema: _Any
    _table: _Any

    def __init__(self, *args, **kwargs):
        raise TypeError("Use pyarrow.schema() to create a Schema")

    @classmethod
    def _wrap(cls, schema, table=None):
        wrapped = cls.__new__(cls)
        wrapped._schema = schema
        wrapped._table = table
        return wrapped

    def __getattr__(self, name):
        raise _missing_attribute("Schema", name)

    def __iter__(self):
        return iter(self._schema.fields)

    def __repr__(self):
        return "\n".join(str(field) for field in self._schema.fields)

    def equals(self, other, check_metadata=False):
        return self._schema.fields == other._schema.fields and (
            not check_metadata or self._schema.metadata == other._schema.metadata
        )

    def field(self, i):
        return self._schema.fields[i]

    def empty_table(self):
        # Streamlit answers a lazy dataframe's out-of-range chunk request with
        # one. The writer builds arrays from data, so this needs the table the
        # schema came from.
        if self._table is None:
            raise _unavailable("Schema.empty_table of a schema made by schema()")
        compute = _writer().compute
        return Table._wrap(compute.slice_table(self._table, 0, 0))

    @property
    def names(self):
        return self._schema.names

    @property
    def metadata(self):
        return dict(self._schema.metadata) or None

    @property
    def pandas_metadata(self):
        metadata = self._schema.metadata.get(b"pandas")
        return None if metadata is None else _json.loads(metadata)


def _as_bytes(value):
    return value.encode() if isinstance(value, str) else bytes(value)


def _metadata(metadata):
    return {_as_bytes(k): _as_bytes(v) for k, v in (metadata or {}).items()}


def schema(fields, metadata=None):
    writer = _writer()
    return Schema._wrap(writer.Schema(list(fields), _metadata(metadata)))


class Table:
    # The arrow_ipc_writer object this wraps.
    _table: _Any

    def __init__(self, *args, **kwargs):
        raise TypeError(
            "Do not call Table's constructor directly, use one of the "
            "`Table.from_*` functions instead."
        )

    @classmethod
    def _wrap(cls, table):
        wrapped = cls.__new__(cls)
        wrapped._table = table
        return wrapped

    @classmethod
    def from_pandas(
        cls,
        df,
        schema=None,
        preserve_index=None,
        nthreads=None,
        columns=None,
        safe=True,
    ):
        if schema is not None or columns is not None:
            raise _unavailable("Table.from_pandas with a schema or columns")
        return cls._wrap(_writer().table_from_pandas(df, preserve_index=preserve_index))

    def __getattr__(self, name):
        raise _missing_attribute("Table", name)

    @property
    def schema(self):
        return Schema._wrap(self._table.schema, self._table)

    @property
    def num_rows(self):
        return self._table.num_rows

    def slice(self, offset=0, length=None):
        compute = _writer().compute
        return Table._wrap(compute.slice_table(self._table, offset, length))

    def take(self, indices):
        compute = _writer().compute
        return Table._wrap(compute.take_table(self._table, _indices(indices)))

    def cast(self, target_schema):
        # Streamlit casts only to replace large_* types, which the writer never
        # produces, so a cast here never needs to change anything.
        if target_schema.equals(self.schema):
            return self
        raise _unavailable("Table.cast to a different schema")


class Array:
    # The arrow_ipc_writer object this wraps.
    _array: _Any

    def __init__(self, *args, **kwargs):
        raise TypeError(
            "Do not call Array's constructor directly, use pyarrow.array() instead."
        )

    @classmethod
    def _wrap(cls, array):
        wrapped = cls.__new__(cls)
        wrapped._array = array
        return wrapped

    def __getattr__(self, name):
        raise _missing_attribute("Array", name)


# pandas' `is_pyarrow_array` checks values against it.
class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise _unavailable("ChunkedArray")


def array(obj, type=None, mask=None, size=None, from_pandas=None, safe=True):
    import pandas as pd

    if type is not None or mask is not None or size is not None:
        raise _unavailable("array with a type, mask or size")
    if not isinstance(obj, (pd.Series, pd.Index)):
        raise _unavailable("array from anything but a pandas Series or Index")
    return Array._wrap(_writer().convert.from_pandas(obj))


def _indices(indices):
    import numpy as np

    if isinstance(indices, Array):
        return _writer().compute.integer_values(indices._array)
    return np.asarray(indices, dtype=np.int64)


# pyarrow's large_* types: the writer never produces them, so Streamlit's
# downcasting of them finds nothing to do.
class LargeListType:
    def __init__(self, *args, **kwargs):
        raise _unavailable("LargeListType")


class _LargeType:
    def __init__(self, name):
        self._name = name

    def __eq__(self, other):
        return isinstance(other, _LargeType) and other._name == self._name

    def __hash__(self):
        return hash(("large", self._name))

    def __repr__(self):
        return self._name


def large_string():
    return _LargeType("large_string")


def large_binary():
    return _LargeType("large_binary")


def string():
    return _writer().types.string()


def binary():
    return _writer().types.binary()


def list_(value_type):
    return _writer().types.list_(value_type)


class Buffer:
    def __init__(self, data):
        self._data = data

    def to_pybytes(self):
        return self._data


class BufferOutputStream:
    def __init__(self):
        self._parts = []

    def write(self, data):
        self._parts.append(bytes(data))
        return len(data)

    def getvalue(self):
        return Buffer(b"".join(self._parts))


class RecordBatchStreamWriter:
    """Collects the table written to it and serializes it on `close()`; the
    writer produces a whole stream at once, as Streamlit writes one table."""

    def __init__(self, sink, schema):
        self._sink = sink
        self._tables = []

    def write_table(self, table):
        if not isinstance(table, Table):
            raise TypeError(f"Expected a pyarrow.Table, got {type(table).__name__}")
        self._tables.append(table)

    def close(self):
        tables, self._tables = self._tables, []
        if len(tables) != 1:
            raise _unavailable("RecordBatchStreamWriter with other than one table")
        self._sink.write(_writer().write_stream(tables[0]._table))


def _predicate(name, test):
    def predicate(t):
        return test(_writer().types, t)

    predicate.__name__ = name
    return predicate


# The checks Streamlit makes on a field's type to configure its column.
types = _ModuleType("pyarrow.types")
for _name, _test in {
    "is_null": lambda w, t: isinstance(t, w.NullType),
    "is_boolean": lambda w, t: isinstance(t, w.BoolType),
    "is_integer": lambda w, t: isinstance(t, w.IntType),
    "is_floating": lambda w, t: isinstance(t, w.FloatType),
    "is_decimal": lambda w, t: isinstance(t, w.DecimalType),
    "is_string": lambda w, t: isinstance(t, w.StringType),
    "is_binary": lambda w, t: isinstance(t, w.BinaryType),
    "is_date": lambda w, t: isinstance(t, w.Date32Type),
    "is_time": lambda w, t: isinstance(t, w.Time64Type),
    "is_timestamp": lambda w, t: isinstance(t, w.TimestampType),
    "is_duration": lambda w, t: isinstance(t, w.DurationType),
    "is_list": lambda w, t: isinstance(t, w.ListType),
    "is_struct": lambda w, t: isinstance(t, w.StructType),
}.items():
    setattr(types, _name, _predicate(_name, _test))
# The writer never produces large strings.
types.is_large_string = lambda t: False  # type: ignore[attr-defined]
types.__getattr__ = lambda name: _raise(_missing_attribute("types", name))  # type: ignore[attr-defined]


def _raise(error):
    raise error


def _sort_indices(input, sort_keys=(), *, null_placement=None, options=None):
    if not isinstance(input, Table):
        raise _unavailable("compute.sort_indices on anything but a Table")
    if options is not None or null_placement not in (None, "at_end"):
        raise _unavailable("compute.sort_indices with options or nulls at start")
    compute = _writer().compute
    return Array._wrap(
        compute.indices_array(compute.sort_indices(input._table, sort_keys))
    )


compute = _ModuleType("pyarrow.compute")
compute.sort_indices = _sort_indices  # type: ignore[attr-defined]
compute.__getattr__ = lambda name: _raise(_missing_attribute("compute", name))  # type: ignore[attr-defined]

_SUBMODULES = {"pyarrow.compute": compute, "pyarrow.types": types}
