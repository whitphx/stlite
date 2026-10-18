"""The Arrow IPC streaming format.

A stream is a Schema message, one DictionaryBatch per dictionary-encoded
field, the RecordBatch, and an end-of-stream marker. Each message is a
FlatBuffers `Message` (format/Message.fbs and format/Schema.fbs in the Arrow
repository) followed by its body, the arrays' buffers.
"""

from __future__ import annotations

import struct
from dataclasses import dataclass

from . import types as t
from ._flatbuffers import Builder
from .array import Array
from .errors import ArrowNotImplementedError
from .table import Table

_CONTINUATION = b"\xff\xff\xff\xff"
_METADATA_V5 = 4
_ALIGNMENT = 8

# Message.fbs: MessageHeader union
_HEADER_SCHEMA = 1
_HEADER_DICTIONARY_BATCH = 2
_HEADER_RECORD_BATCH = 3

# Schema.fbs: Type union
_TYPE_NULL = 1
_TYPE_INT = 2
_TYPE_FLOATING_POINT = 3
_TYPE_BINARY = 4
_TYPE_UTF8 = 5
_TYPE_BOOL = 6
_TYPE_DECIMAL = 7
_TYPE_DATE = 8
_TYPE_TIME = 9
_TYPE_TIMESTAMP = 10
_TYPE_LIST = 12
_TYPE_STRUCT = 13
_TYPE_DURATION = 18

_TIME_UNIT = {"s": 0, "ms": 1, "us": 2, "ns": 3}
_FLOAT_PRECISION = {16: 0, 32: 1, 64: 2}


def _pad(n: int) -> int:
    return (-n) % _ALIGNMENT


@dataclass
class _DictionaryIds:
    """Assigns dictionary ids in depth-first field order, as pyarrow does."""

    next_id: int = 0

    def take(self) -> int:
        id_ = self.next_id
        self.next_id += 1
        return id_


# Schema


def _type_table(b: Builder, type_: t.DataType) -> tuple[int, int]:
    """Builds the Type union member for `type_`; returns (union type, offset)."""
    if isinstance(type_, t.NullType):
        b.start_table(0)
        return _TYPE_NULL, b.end_table()
    if isinstance(type_, t.BoolType):
        b.start_table(0)
        return _TYPE_BOOL, b.end_table()
    if isinstance(type_, t.IntType):
        return _TYPE_INT, _int_table(b, type_)
    if isinstance(type_, t.FloatType):
        b.start_table(1)
        b.add_scalar(0, "<h", _FLOAT_PRECISION[type_.bit_width], 0)
        return _TYPE_FLOATING_POINT, b.end_table()
    if isinstance(type_, t.StringType):
        b.start_table(0)
        return _TYPE_UTF8, b.end_table()
    if isinstance(type_, t.BinaryType):
        b.start_table(0)
        return _TYPE_BINARY, b.end_table()
    if isinstance(type_, t.DecimalType):
        b.start_table(3)
        b.add_scalar(0, "<i", type_.precision, 0)
        b.add_scalar(1, "<i", type_.scale, 0)
        b.add_scalar(2, "<i", type_.bit_width, 128)
        return _TYPE_DECIMAL, b.end_table()
    if isinstance(type_, t.Date32Type):
        b.start_table(1)
        b.add_scalar(0, "<h", 0, 1)  # DateUnit.DAY; MILLISECOND is the default
        return _TYPE_DATE, b.end_table()
    if isinstance(type_, t.Time64Type):
        b.start_table(2)
        b.add_scalar(0, "<h", _TIME_UNIT[type_.unit], 1)
        b.add_scalar(1, "<i", 64, 32)
        return _TYPE_TIME, b.end_table()
    if isinstance(type_, t.TimestampType):
        tz = b.create_string(type_.tz) if type_.tz is not None else None
        b.start_table(2)
        b.add_scalar(0, "<h", _TIME_UNIT[type_.unit], 0)
        b.add_offset(1, tz)
        return _TYPE_TIMESTAMP, b.end_table()
    if isinstance(type_, t.DurationType):
        b.start_table(1)
        b.add_scalar(0, "<h", _TIME_UNIT[type_.unit], 1)
        return _TYPE_DURATION, b.end_table()
    if isinstance(type_, t.ListType):
        b.start_table(0)
        return _TYPE_LIST, b.end_table()
    if isinstance(type_, t.StructType):
        b.start_table(0)
        return _TYPE_STRUCT, b.end_table()
    raise ArrowNotImplementedError(f"Cannot encode type {type_}")


def _int_table(b: Builder, type_: t.IntType) -> int:
    b.start_table(2)
    b.add_scalar(0, "<i", type_.bit_width, 0)
    b.add_scalar(1, "<?", type_.signed, False)
    return b.end_table()


def _key_values(b: Builder, pairs: list[tuple[str | bytes, str | bytes]]) -> int:
    offsets = []
    for key, value in pairs:
        key_off = b.create_string(key)
        value_off = b.create_string(value)
        b.start_table(2)
        b.add_offset(0, key_off)
        b.add_offset(1, value_off)
        offsets.append(b.end_table())
    return b.create_offset_vector(offsets)


def _field(b: Builder, f: t.Field, ids: _DictionaryIds) -> int:
    type_ = f.type
    metadata: list[tuple[str | bytes, str | bytes]] = list(f.metadata)

    # A dictionary-encoded field is written as its value type plus a
    # DictionaryEncoding; an extension type, which may be such a value type
    # (pd.cut gives dictionary<values=pandas.interval>), as its storage type
    # plus the extension metadata.
    dictionary_off = None
    if isinstance(type_, t.DictionaryType):
        index_off = _int_table(b, type_.index_type)
        b.start_table(4)
        b.add_scalar(0, "<q", ids.take(), 0)
        b.add_offset(1, index_off)
        b.add_scalar(2, "<?", type_.ordered, False)
        dictionary_off = b.end_table()
        type_ = type_.value_type

    if isinstance(type_, t.ExtensionType):
        metadata += [
            ("ARROW:extension:name", type_.name),
            ("ARROW:extension:metadata", type_.serialized),
        ]
        type_ = type_.storage_type

    if isinstance(type_, t.ListType):
        child_fields = [type_.value_field]
    elif isinstance(type_, t.StructType):
        child_fields = list(type_.fields)
    else:
        child_fields = []
    children_off = b.create_offset_vector([_field(b, c, ids) for c in child_fields])

    name_off = b.create_string(f.name)
    type_type, type_off = _type_table(b, type_)
    metadata_off = _key_values(b, metadata) if metadata else None

    b.start_table(7)
    b.add_offset(0, name_off)
    b.add_scalar(1, "<?", f.nullable, False)
    b.add_scalar(2, "<B", type_type, 0)
    b.add_offset(3, type_off)
    b.add_offset(4, dictionary_off)
    b.add_offset(5, children_off)
    b.add_offset(6, metadata_off)
    return b.end_table()


def _message(b: Builder, header_type: int, header: int, body_length: int) -> bytes:
    b.start_table(5)
    b.add_scalar(0, "<h", _METADATA_V5, 0)
    b.add_scalar(1, "<B", header_type, 0)
    b.add_offset(2, header)
    b.add_scalar(3, "<q", body_length, 0)
    return b.finish(b.end_table())


def _schema_message(table: Table) -> bytes:
    b = Builder()
    ids = _DictionaryIds()
    fields_off = b.create_offset_vector(
        [_field(b, f, ids) for f in table.schema.fields]
    )
    metadata_off = (
        _key_values(b, list(table.schema.metadata.items()))
        if table.schema.metadata
        else None
    )
    b.start_table(4)
    b.add_offset(1, fields_off)
    b.add_offset(2, metadata_off)
    return _message(b, _HEADER_SCHEMA, b.end_table(), 0)


# Record batches


def _collect(
    array: Array,
    nodes: list[tuple[int, int]],
    buffers: list[bytes | None],
    dictionaries: list[Array],
) -> None:
    nodes.append((array.length, array.null_count))
    buffers.extend(array.buffers)
    if array.dictionary is not None:
        dictionaries.append(array.dictionary)
    for child in array.children:
        _collect(child, nodes, buffers, dictionaries)


def _record_batch(
    arrays: list[Array],
) -> tuple[list[tuple[int, int]], list[bytes | None], list[Array]]:
    nodes: list[tuple[int, int]] = []
    buffers: list[bytes | None] = []
    dictionaries: list[Array] = []
    for array in arrays:
        _collect(array, nodes, buffers, dictionaries)
    return nodes, buffers, dictionaries


def _body(buffers: list[bytes | None]) -> tuple[list[tuple[int, int]], bytes]:
    spans = []
    parts = []
    offset = 0
    for data in buffers:
        data = data or b""
        spans.append((offset, len(data)))
        parts.append(data + b"\x00" * _pad(len(data)))
        offset += len(data) + _pad(len(data))
    return spans, b"".join(parts)


def _record_batch_table(
    b: Builder,
    length: int,
    nodes: list[tuple[int, int]],
    spans: list[tuple[int, int]],
) -> int:
    nodes_off = b.create_struct_vector("<qq", 8, nodes)
    buffers_off = b.create_struct_vector("<qq", 8, spans)
    b.start_table(5)
    b.add_scalar(0, "<q", length, 0)
    b.add_offset(1, nodes_off)
    b.add_offset(2, buffers_off)
    return b.end_table()


def _framed(metadata: bytes, body: bytes) -> bytes:
    padding = _pad(len(metadata))
    return (
        _CONTINUATION
        + struct.pack("<i", len(metadata) + padding)
        + metadata
        + b"\x00" * padding
        + body
    )


def _dictionary_batch_message(dictionary_id: int, dictionary: Array) -> bytes:
    nodes, buffers, nested = _record_batch([dictionary])
    if nested:
        raise ArrowNotImplementedError("Dictionaries of dictionary-encoded values")
    b = Builder()
    spans, body = _body(buffers)
    data_off = _record_batch_table(b, dictionary.length, nodes, spans)
    b.start_table(3)
    b.add_scalar(0, "<q", dictionary_id, 0)
    b.add_offset(1, data_off)
    header = b.end_table()
    return _framed(_message(b, _HEADER_DICTIONARY_BATCH, header, len(body)), body)


def _record_batch_message(
    length: int, nodes: list[tuple[int, int]], buffers: list[bytes | None]
) -> bytes:
    b = Builder()
    spans, body = _body(buffers)
    header = _record_batch_table(b, length, nodes, spans)
    return _framed(_message(b, _HEADER_RECORD_BATCH, header, len(body)), body)


def write_stream(table: Table) -> bytes:
    """Serializes `table` in the Arrow IPC streaming format."""
    nodes, buffers, dictionaries = _record_batch(table.columns)
    parts = [_framed(_schema_message(table), b"")]
    # Dictionaries are collected depth-first, the order in which the schema
    # numbered them.
    parts += [
        _dictionary_batch_message(dictionary_id, dictionary)
        for dictionary_id, dictionary in enumerate(dictionaries)
    ]
    parts.append(_record_batch_message(table.num_rows, nodes, buffers))
    parts.append(_CONTINUATION + b"\x00\x00\x00\x00")
    return b"".join(parts)
