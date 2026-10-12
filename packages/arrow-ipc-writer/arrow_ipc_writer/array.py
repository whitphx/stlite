"""Arrow arrays as their buffers, in the order the IPC format lays them out."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence

import numpy as np

from . import types as t


@dataclass
class Array:
    type: t.DataType
    length: int
    null_count: int
    # The array's own buffers in IPC order; `None` for an omitted validity
    # bitmap. Children (list values, struct fields) are separate arrays.
    buffers: list[bytes | None]
    children: list[Array] = field(default_factory=list)
    # For dictionary-encoded arrays, the dictionary values.
    dictionary: Array | None = None

    def __len__(self) -> int:
        return self.length


def _bitmap(bits: np.ndarray) -> bytes:
    return np.packbits(bits.astype(np.bool_, copy=False), bitorder="little").tobytes()


def validity(valid: np.ndarray | None, length: int) -> tuple[bytes | None, int]:
    """The validity bitmap and null count; no bitmap when nothing is null."""
    if valid is None:
        return None, 0
    null_count = int(length - np.count_nonzero(valid))
    if null_count == 0:
        return None, 0
    return _bitmap(valid), null_count


def null_array(length: int) -> Array:
    return Array(t.null(), length, length, [])


def primitive_array(
    type_: t.DataType, values: np.ndarray, valid: np.ndarray | None = None
) -> Array:
    """A fixed-width array; `values` must already have the type's layout."""
    length = len(values)
    bitmap, null_count = validity(valid, length)
    data = np.ascontiguousarray(values)
    if data.dtype.byteorder == ">":
        data = data.byteswap().view(data.dtype.newbyteorder("<"))
    return Array(type_, length, null_count, [bitmap, data.tobytes()])


def bool_array(values: np.ndarray, valid: np.ndarray | None = None) -> Array:
    length = len(values)
    bitmap, null_count = validity(valid, length)
    return Array(t.bool_(), length, null_count, [bitmap, _bitmap(values)])


def binary_like_array(
    type_: t.StringType | t.BinaryType,
    values: Sequence[bytes | None],
) -> Array:
    """A string or binary array from encoded values, `None` for nulls."""
    length = len(values)
    valid = np.fromiter((v is not None for v in values), dtype=np.bool_, count=length)
    lengths = np.fromiter(
        (len(v) if v is not None else 0 for v in values), dtype=np.int64, count=length
    )
    offsets = np.zeros(length + 1, dtype=np.int64)
    np.cumsum(lengths, out=offsets[1:])
    if not type_.large and offsets[-1] > np.iinfo(np.int32).max:
        from .errors import ArrowCapacityError

        raise ArrowCapacityError(
            f"array cannot contain more than {np.iinfo(np.int32).max} bytes"
        )
    offset_dtype = np.int64 if type_.large else np.int32
    bitmap, null_count = validity(valid, length)
    data = b"".join(v for v in values if v is not None)
    return Array(
        type_,
        length,
        null_count,
        [bitmap, offsets.astype(offset_dtype).tobytes(), data],
    )


def list_array(
    type_: t.ListType, offsets: np.ndarray, child: Array, valid: np.ndarray | None
) -> Array:
    length = len(offsets) - 1
    bitmap, null_count = validity(valid, length)
    return Array(
        type_,
        length,
        null_count,
        [bitmap, offsets.astype(np.int32).tobytes()],
        children=[child],
    )


def struct_array(
    type_: t.StructType, children: list[Array], length: int, valid: np.ndarray | None
) -> Array:
    bitmap, null_count = validity(valid, length)
    return Array(type_, length, null_count, [bitmap], children=children)


def dictionary_array(
    type_: t.DictionaryType,
    indices: np.ndarray,
    valid: np.ndarray | None,
    dictionary: Array,
) -> Array:
    indices_array = primitive_array(type_.index_type, indices, valid)
    return Array(
        type_,
        indices_array.length,
        indices_array.null_count,
        indices_array.buffers,
        dictionary=dictionary,
    )


def extension_array(type_: t.ExtensionType, storage: Array) -> Array:
    return Array(
        type_,
        storage.length,
        storage.null_count,
        storage.buffers,
        children=storage.children,
        dictionary=storage.dictionary,
    )
