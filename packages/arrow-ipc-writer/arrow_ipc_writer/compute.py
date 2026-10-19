"""Row selection and sorting on Tables, as `pyarrow.compute` does them.

Streamlit serves large dataframes in chunks, sorted on request, with
`Table.slice`, `Table.take` and `pyarrow.compute.sort_indices`; these are their
counterparts for this package's Tables.
"""

from __future__ import annotations

from collections.abc import Sequence
from typing import Literal

import numpy as np

from . import array as a
from . import types as t
from .errors import ArrowInvalid, ArrowNotImplementedError, ArrowTypeError
from .table import Table

SortOrder = Literal["ascending", "descending"]


def _bits(buffer: bytes, length: int) -> np.ndarray:
    return np.unpackbits(
        np.frombuffer(buffer, dtype=np.uint8), count=length, bitorder="little"
    ).astype(np.bool_)


def _valid(array: a.Array) -> np.ndarray | None:
    """The validity mask, or `None` when no value is null."""
    if isinstance(array.type, t.NullType):
        return np.zeros(array.length, dtype=np.bool_)
    bitmap = array.buffers[0]
    return None if bitmap is None else _bits(bitmap, array.length)


def _item_size(type_: t.DataType) -> int | None:
    """Bytes per value of a fixed-width type; `None` for any other type."""
    if isinstance(type_, (t.IntType, t.FloatType, t.DecimalType)):
        return type_.bit_width // 8
    if isinstance(type_, t.Date32Type):
        return 4
    if isinstance(type_, (t.Time64Type, t.TimestampType, t.DurationType)):
        return 8
    return None


def _int_dtype(type_: t.IntType) -> np.dtype:
    return np.dtype(f"<{'i' if type_.signed else 'u'}{type_.bit_width // 8}")


def _offsets(array: a.Array) -> np.ndarray:
    buffer = array.buffers[1]
    if buffer is None:
        raise ValueError(f"{array.type} array has no offsets buffer")
    return np.frombuffer(buffer, dtype=np.int32, count=array.length + 1).astype(
        np.int64
    )


def _ranges(starts: np.ndarray, lengths: np.ndarray) -> np.ndarray:
    """The positions `starts[i] .. starts[i] + lengths[i]`, laid end to end."""
    total = int(lengths.sum())
    run_starts = np.zeros(len(lengths), dtype=np.int64)
    np.cumsum(lengths[:-1], out=run_starts[1:])
    return np.repeat(starts - run_starts, lengths) + np.arange(total, dtype=np.int64)


def take(array: a.Array, indices: np.ndarray) -> a.Array:
    """The values of `array` at `indices`, in that order."""
    indices = np.asarray(indices, dtype=np.int64)
    if len(indices) and (indices.min() < 0 or indices.max() >= array.length):
        raise IndexError(f"Index out of bounds for an array of length {array.length}")
    type_ = array.type
    length = len(indices)
    valid = _valid(array)
    taken_valid = None if valid is None else valid[indices]

    if isinstance(type_, t.NullType):
        return a.null_array(length)
    if isinstance(type_, t.BoolType):
        data = array.buffers[1]
        if data is None:
            raise ValueError("bool array has no data buffer")
        return a.bool_array(_bits(data, array.length)[indices], taken_valid)
    if isinstance(type_, t.DictionaryType):
        codes = np.frombuffer(
            array.buffers[1] or b"",
            dtype=_int_dtype(type_.index_type),
            count=array.length,
        )
        if array.dictionary is None:
            raise ValueError("dictionary array has no dictionary")
        return a.dictionary_array(type_, codes[indices], taken_valid, array.dictionary)
    item_size = _item_size(type_)
    if item_size is not None:
        values = np.frombuffer(
            array.buffers[1] or b"",
            dtype=np.dtype((np.void, item_size)),
            count=array.length,
        )
        return a.primitive_array(type_, values[indices], taken_valid)
    if isinstance(type_, (t.StringType, t.BinaryType)):
        offsets = _offsets(array)
        starts = offsets[indices]
        lengths = offsets[indices + 1] - starts
        data = np.frombuffer(array.buffers[2] or b"", dtype=np.uint8)
        new_offsets = np.zeros(length + 1, dtype=np.int64)
        np.cumsum(lengths, out=new_offsets[1:])
        return a.binary_array(
            type_,
            new_offsets,
            data[_ranges(starts, lengths)].tobytes(),
            np.ones(length, dtype=np.bool_) if taken_valid is None else taken_valid,
        )
    if isinstance(type_, t.ListType):
        offsets = _offsets(array)
        starts = offsets[indices]
        lengths = offsets[indices + 1] - starts
        new_offsets = np.zeros(length + 1, dtype=np.int64)
        np.cumsum(lengths, out=new_offsets[1:])
        child = take(array.children[0], _ranges(starts, lengths))
        return a.list_array(type_, new_offsets, child, taken_valid)
    if isinstance(type_, t.StructType):
        children = [take(child, indices) for child in array.children]
        return a.struct_array(type_, children, length, taken_valid)
    if isinstance(type_, t.ExtensionType):
        storage = a.Array(
            type_.storage_type,
            array.length,
            array.null_count,
            array.buffers,
            children=array.children,
            dictionary=array.dictionary,
        )
        return a.extension_array(type_, take(storage, indices))
    raise ArrowNotImplementedError(f"take is not implemented for {type_}")


def indices_array(indices: np.ndarray) -> a.Array:
    """Row indices as the uint64 array pyarrow returns them in."""
    return a.primitive_array(t.uint64(), np.asarray(indices, dtype=np.uint64))


def integer_values(array: a.Array) -> np.ndarray:
    """An integer array's values as int64, e.g. to `take` the rows it lists."""
    if not isinstance(array.type, t.IntType):
        raise ArrowTypeError(f"Expected an integer array, got {array.type}")
    if array.null_count:
        raise ArrowInvalid("Indices must not be null")
    values = np.frombuffer(
        array.buffers[1] or b"", dtype=_int_dtype(array.type), count=array.length
    )
    return values.astype(np.int64)


def take_table(table: Table, indices: np.ndarray) -> Table:
    """The rows of `table` at `indices`, in that order."""
    indices = np.asarray(indices, dtype=np.int64)
    return Table(
        table.schema, [take(column, indices) for column in table.columns], len(indices)
    )


def slice_table(table: Table, offset: int = 0, length: int | None = None) -> Table:
    """`length` rows of `table` from `offset` on, fewer if the table ends first."""
    if offset < 0:
        raise IndexError("Offset must be non-negative")
    start = min(offset, table.num_rows)
    stop = table.num_rows if length is None else min(start + length, table.num_rows)
    return take_table(table, np.arange(start, max(start, stop), dtype=np.int64))


# Sorting places each row in one of these groups, in this order.
_VALUE, _NAN, _NULL = 0, 1, 2


def _sort_values(array: a.Array) -> np.ndarray:
    """The column's values in a form numpy orders as pyarrow does."""
    type_ = array.type
    if isinstance(type_, t.BoolType):
        return _bits(array.buffers[1] or b"", array.length)
    if isinstance(type_, t.IntType):
        return np.frombuffer(
            array.buffers[1] or b"", dtype=_int_dtype(type_), count=array.length
        )
    if isinstance(type_, t.FloatType):
        if type_.bit_width == 16:
            raise ArrowNotImplementedError(str(type_))
        return np.frombuffer(
            array.buffers[1] or b"",
            dtype=np.dtype(f"<f{type_.bit_width // 8}"),
            count=array.length,
        )
    if isinstance(type_, t.Date32Type):
        return np.frombuffer(array.buffers[1] or b"", dtype="<i4", count=array.length)
    if isinstance(type_, (t.Time64Type, t.TimestampType, t.DurationType)):
        return np.frombuffer(array.buffers[1] or b"", dtype="<i8", count=array.length)
    if isinstance(type_, t.DecimalType):
        # Every value shares the column's scale, so the unscaled integers order
        # as the decimals do.
        size = type_.bit_width // 8
        data = array.buffers[1] or b""
        return np.array(
            [
                int.from_bytes(data[i * size : (i + 1) * size], "little", signed=True)
                for i in range(array.length)
            ],
            dtype=object,
        )
    if isinstance(type_, (t.StringType, t.BinaryType)):
        # UTF-8 bytes order as their code points do, so strings stay encoded.
        offsets = _offsets(array)
        data = array.buffers[2] or b""
        return np.array(
            [data[offsets[i] : offsets[i + 1]] for i in range(array.length)],
            dtype=object,
        )
    if isinstance(type_, (t.ListType, t.ExtensionType)):
        raise ArrowTypeError(f"Sorting not supported for type {type_}")
    raise ArrowNotImplementedError(str(type_))


def _sort_keys(
    array: a.Array, order: SortOrder, parent_valid: np.ndarray | None = None
) -> list[tuple[np.ndarray, np.ndarray]]:
    """Each row's group (value, NaN or null) and its rank within the group.

    A struct column gives a pair for each of its leaf fields, in order: pyarrow
    sorts it by them, a null at any level making the leaves below it null.
    """
    valid = _valid(array)
    if parent_valid is not None:
        valid = parent_valid if valid is None else valid & parent_valid
    if isinstance(array.type, t.StructType):
        return [
            key for child in array.children for key in _sort_keys(child, order, valid)
        ]

    group = np.full(array.length, _VALUE, dtype=np.int8)
    rank = np.zeros(array.length, dtype=np.int64)
    if isinstance(array.type, t.NullType):
        group[:] = _NULL
        return [(group, rank)]

    if valid is None:
        valid = np.ones(array.length, dtype=np.bool_)
    values = _sort_values(array)
    if values.dtype.kind == "f":
        nan = valid & np.isnan(values)
        group[nan] = _NAN
        valid = valid & ~nan
    group[~valid] = _NULL

    if valid.any():
        _, inverse = np.unique(values[valid], return_inverse=True)
        rank[valid] = inverse if order == "ascending" else -inverse
    return [(group, rank)]


def sort_indices(
    table: Table, sort_keys: Sequence[tuple[str, SortOrder]]
) -> np.ndarray:
    """The row order `pyarrow.compute.sort_indices(table, sort_keys)` gives: a
    stable sort with NaNs after the values and nulls last, in either order."""
    names = table.schema.names
    keys: list[np.ndarray] = []
    for name, order in sort_keys:
        if order not in ("ascending", "descending"):
            raise ValueError(f"Unknown sort order {order!r}")
        if names.count(name) != 1:
            raise KeyError(f"No unique column named {name!r}")
        for group, rank in _sort_keys(table.columns[names.index(name)], order):
            keys += [group, rank]
    if not keys:
        return np.arange(table.num_rows, dtype=np.int64)
    # np.lexsort sorts by its last key first, and is stable.
    return np.lexsort(keys[::-1]).astype(np.int64)
