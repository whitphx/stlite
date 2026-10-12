# Ported from Apache Arrow's python/pyarrow/pandas_compat.py
# https://github.com/apache/arrow/blob/apache-arrow-24.0.0/python/pyarrow/pandas_compat.py
# Modified for arrow-ipc-writer: it builds this package's types and arrays
# instead of pyarrow's, and keeps only what Table.from_pandas needs to build
# a table and its "pandas" schema metadata, which Streamlit's frontend reads
# to recover index columns and column types.
#
# The original license header follows.
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

"""Converting a pandas DataFrame to a Table, with pyarrow's pandas metadata."""

from __future__ import annotations

import json
import math
import warnings
from collections.abc import Sequence
from typing import Any

import numpy as np

from . import __version__
from . import types as t
from .array import Array
from .convert import _tz_name, from_pandas
from .errors import ArrowException
from .table import Schema, Table


def get_logical_type(arrow_type: t.DataType) -> str:
    if isinstance(arrow_type, t.NullType):
        return "empty"
    if isinstance(arrow_type, t.BoolType):
        return "bool"
    if isinstance(arrow_type, t.IntType):
        return str(arrow_type)
    if isinstance(arrow_type, t.FloatType):
        return f"float{arrow_type.bit_width}"
    if isinstance(arrow_type, t.Date32Type):
        return "date"
    if isinstance(arrow_type, t.Time64Type):
        return "time"
    if isinstance(arrow_type, t.BinaryType):
        return "bytes"
    if isinstance(arrow_type, t.StringType):
        return "unicode"
    if isinstance(arrow_type, t.DictionaryType):
        return "categorical"
    if isinstance(arrow_type, t.ListType):
        return f"list[{get_logical_type(arrow_type.value_type)}]"
    if isinstance(arrow_type, t.TimestampType):
        return "datetimetz" if arrow_type.tz is not None else "datetime"
    if isinstance(arrow_type, t.DecimalType):
        return "decimal"
    return "object"


_NUMPY_LOGICAL_TYPES = {
    np.bool_: "bool",
    np.int8: "int8",
    np.int16: "int16",
    np.int32: "int32",
    np.int64: "int64",
    np.uint8: "uint8",
    np.uint16: "uint16",
    np.uint32: "uint32",
    np.uint64: "uint64",
    np.float32: "float32",
    np.float64: "float64",
    np.str_: "string",
    np.bytes_: "bytes",
}


def get_logical_type_from_numpy(pandas_collection: Any) -> str:
    import pandas as pd

    dtype = pandas_collection.dtype
    try:
        return _NUMPY_LOGICAL_TYPES[dtype.type]
    except KeyError, TypeError:
        pass
    if str(dtype) == "datetime64[D]":
        return "date"
    if hasattr(dtype, "tz"):
        return "datetimetz"
    if str(dtype).startswith("datetime64"):
        return str(dtype)
    result = pd.api.types.infer_dtype(pandas_collection, skipna=False)
    if result == "string":
        return "unicode"
    return result


def get_extension_dtype_info(column: Any) -> tuple[str, dict[str, Any] | None]:
    dtype = column.dtype
    metadata: dict[str, Any] | None
    if str(dtype) == "category":
        cats = getattr(column, "cat", column)
        metadata = {
            "num_categories": len(cats.categories),
            "ordered": cats.ordered,
        }
        physical_dtype = str(cats.codes.dtype)
    elif hasattr(dtype, "tz"):
        metadata = {"timezone": _tz_name(dtype.tz)}
        physical_dtype = f"datetime64[{dtype.unit}]"
    else:
        metadata = None
        physical_dtype = str(dtype)
    return physical_dtype, metadata


def get_column_metadata(
    column: Any, name: Any, arrow_type: t.DataType, field_name: str
) -> dict[str, Any]:
    logical_type = get_logical_type(arrow_type)

    string_dtype, extra_metadata = get_extension_dtype_info(column)
    if isinstance(arrow_type, t.DecimalType):
        extra_metadata = {
            "precision": arrow_type.precision,
            "scale": arrow_type.scale,
        }
        string_dtype = "object"

    if (
        name is not None
        and not (isinstance(name, float) and math.isnan(name))
        and not isinstance(name, str)
    ):
        raise TypeError(
            f"Column name must be a string. Got column {name} of type "
            f"{type(name).__name__}"
        )

    return {
        "name": name,
        "field_name": field_name,
        "pandas_type": logical_type,
        "numpy_type": string_dtype,
        "metadata": extra_metadata,
    }


def _get_simple_index_descriptor(level: Any, name: Any) -> dict[str, Any]:
    string_dtype, extra_metadata = get_extension_dtype_info(level)
    pandas_type = get_logical_type_from_numpy(level)
    if "mixed" in pandas_type:
        warnings.warn(
            "The DataFrame has column names of mixed type. They will be "
            "converted to strings and not roundtrip correctly.",
            UserWarning,
            stacklevel=4,
        )
    if pandas_type == "unicode":
        extra_metadata = {"encoding": "UTF-8"}
    return {
        "name": name,
        "field_name": name,
        "pandas_type": pandas_type,
        "numpy_type": string_dtype,
        "metadata": extra_metadata,
    }


def _column_name_to_strings(name: Any) -> Any:
    if isinstance(name, str):
        return name
    elif isinstance(name, bytes):
        return name.decode("utf8")
    elif isinstance(name, tuple):
        return str(tuple(map(_column_name_to_strings, name)))
    elif isinstance(name, Sequence):
        raise TypeError("Unsupported type for MultiIndex level")
    elif name is None or (isinstance(name, float) and math.isnan(name)):
        return name
    return str(name)


def _index_level_name(index: Any, i: int, column_names: list[Any]) -> str:
    if index.name is not None and index.name not in column_names:
        return _column_name_to_strings(index.name)
    else:
        return f"__index_level_{i:d}__"


def _level_name(name: Any) -> Any:
    try:
        json.dumps(name)
        return name
    except TypeError:
        return str(name)


def _get_range_index_descriptor(level: Any) -> dict[str, Any]:
    return {
        "kind": "range",
        "name": _level_name(level.name),
        "start": level.start,
        "stop": level.stop,
        "step": level.step,
    }


def _get_index_level_values(index: Any) -> list[Any]:
    n = len(getattr(index, "levels", [index]))
    return [index.get_level_values(i) for i in range(n)]


def _construct_metadata(
    columns_to_convert: list[Any],
    df: Any,
    column_names: list[Any],
    column_field_names: list[str],
    index_levels: list[Any],
    index_descriptors: list[Any],
    preserve_index: bool | None,
    types: list[t.DataType],
) -> dict[bytes, bytes]:
    import pandas as pd

    serialized_index_levels = [
        (level, descriptor)
        for level, descriptor in zip(index_levels, index_descriptors)
        if not isinstance(descriptor, dict)
    ]

    ntypes = len(types)
    df_types = types[: ntypes - len(serialized_index_levels)]
    index_types = types[ntypes - len(serialized_index_levels) :]

    column_metadata = [
        get_column_metadata(
            col, name=name, arrow_type=arrow_type, field_name=field_name
        )
        for col, name, field_name, arrow_type in zip(
            columns_to_convert, column_names, column_field_names, df_types
        )
    ]

    index_column_metadata = []
    if preserve_index is not False:
        non_str_index_names = []
        for (level, descriptor), arrow_type in zip(
            serialized_index_levels, index_types
        ):
            if level.name is not None and not isinstance(level.name, str):
                non_str_index_names.append(level.name)
            index_column_metadata.append(
                get_column_metadata(
                    level,
                    name=_column_name_to_strings(level.name),
                    arrow_type=arrow_type,
                    field_name=descriptor,
                )
            )

        if non_str_index_names:
            warnings.warn(
                f"The DataFrame has non-str index name `{non_str_index_names}`"
                " which will be converted to string"
                " and not roundtrip correctly.",
                UserWarning,
                stacklevel=4,
            )

        levels = getattr(df.columns, "levels", [df.columns])
        names = getattr(df.columns, "names", [df.columns.name])
        column_indexes = [
            _get_simple_index_descriptor(level, name)
            for level, name in zip(levels, names)
        ]
    else:
        index_descriptors = index_column_metadata = column_indexes = []

    attributes = df.attrs if hasattr(df, "attrs") else {}
    try:
        json.dumps(attributes)
    except Exception as e:
        attributes = {}
        warnings.warn(
            f"Could not serialize pd.DataFrame.attrs: {e},"
            f" defaulting to empty attributes.",
            UserWarning,
            stacklevel=4,
        )

    return {
        b"pandas": json.dumps(
            {
                "index_columns": index_descriptors,
                "column_indexes": column_indexes,
                "columns": column_metadata + index_column_metadata,
                "attributes": attributes,
                "creator": {"library": "arrow-ipc-writer", "version": __version__},
                "pandas_version": pd.__version__,
            }
        ).encode("utf8")
    }


def table_from_pandas(df: Any, preserve_index: bool | None = None) -> Table:
    """The Table `pyarrow.Table.from_pandas(df, preserve_index)` would build."""
    import pandas as pd

    if not df.columns.is_unique:
        raise ValueError(f"Duplicate column names found: {list(df.columns)}")

    index_levels = (
        _get_index_level_values(df.index) if preserve_index is not False else []
    )

    column_names: list[Any] = []
    column_field_names: list[str] = []
    columns_to_convert: list[Any] = []
    for name in df.columns:
        col = df[name]
        name = _column_name_to_strings(name)
        if isinstance(col.dtype, pd.SparseDtype):
            raise TypeError(f"Sparse pandas data (column {name}) not supported.")
        columns_to_convert.append(col)
        column_names.append(name)
        column_field_names.append(str(name))

    index_descriptors: list[Any] = []
    index_column_names: list[str] = []
    for i, index_level in enumerate(index_levels):
        name = _index_level_name(index_level, i, column_names)
        if isinstance(index_level, pd.RangeIndex) and preserve_index is None:
            descriptor: Any = _get_range_index_descriptor(index_level)
        else:
            columns_to_convert.append(index_level)
            descriptor = name
            index_column_names.append(name)
        index_descriptors.append(descriptor)

    all_names = column_field_names + index_column_names

    arrays: list[Array] = []
    for col in columns_to_convert:
        try:
            arrays.append(from_pandas(col))
        except (ArrowException, OverflowError, TypeError) as e:
            e.args += (
                f"Conversion failed for column {col.name} with type {col.dtype}",
            )
            raise

    types = [array.type for array in arrays]
    metadata = _construct_metadata(
        columns_to_convert,
        df,
        column_names,
        column_field_names,
        index_levels,
        index_descriptors,
        preserve_index,
        types,
    )
    schema = Schema(
        [t.Field(name, type_) for name, type_ in zip(all_names, types)], metadata
    )
    return Table(schema, arrays, len(df))
