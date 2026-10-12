"""Converting pandas, numpy and Python values to Arrow arrays.

This reproduces the choices `pyarrow.array(values, from_pandas=True)` makes:
NaN, None, pd.NA and NaT are nulls, numpy dtypes map to their Arrow
counterparts, and object values have their type inferred.
"""

from __future__ import annotations

import datetime
import decimal
import json
import math
from typing import Any, Iterable, Sequence

import numpy as np

from . import array as a
from . import types as t
from .errors import ArrowInvalid, ArrowNotImplementedError, ArrowTypeError

_EPOCH_DATE = datetime.date(1970, 1, 1)
_EPOCH = datetime.datetime(1970, 1, 1)
_EPOCH_UTC = datetime.datetime(1970, 1, 1, tzinfo=datetime.timezone.utc)
_US_PER_DAY = 86_400_000_000

_INT64_MIN = -(2**63)
_INT64_MAX = 2**63 - 1
_UINT64_MAX = 2**64 - 1


# Null handling


def _is_null(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, float):  # also np.float64
        return math.isnan(value)
    if isinstance(value, np.floating):
        return bool(np.isnan(value))
    if isinstance(value, (np.datetime64, np.timedelta64)):
        return bool(np.isnat(value))
    pd = _pandas()
    return pd is not None and (value is pd.NA or value is pd.NaT)


def _pandas() -> Any:
    try:
        import pandas
    except ImportError:
        return None
    return pandas


# numpy arrays


def _numpy_unit(dtype: np.dtype) -> str:
    unit, count = np.datetime_data(dtype)
    if count != 1 or unit not in t.TIME_UNITS:
        raise ArrowNotImplementedError(
            f"Unsupported {dtype.kind == 'M' and 'datetime64' or 'timedelta64'} "
            "time unit"
        )
    return unit


def _numeric_type(dtype: np.dtype) -> t.IntType | t.FloatType:
    if dtype.kind in "iu":
        return t.IntType(dtype.itemsize * 8, dtype.kind == "i")
    if dtype.itemsize not in (2, 4, 8):
        raise ArrowNotImplementedError(f"Unsupported numpy type {dtype}")
    return t.FloatType(dtype.itemsize * 8)


def from_numpy(values: np.ndarray, nan_is_null: bool = True) -> a.Array:
    """An Arrow array from a one-dimensional numpy array."""
    if values.ndim != 1:
        raise ArrowInvalid("only handle 1-dimensional arrays")
    kind = values.dtype.kind
    if kind == "b":
        return a.bool_array(values)
    if kind in "iu":
        return a.primitive_array(_numeric_type(values.dtype), values)
    if kind == "f":
        valid = ~np.isnan(values) if nan_is_null else None
        return a.primitive_array(_numeric_type(values.dtype), values, valid)
    if kind == "M":
        unit, count = np.datetime_data(values.dtype)
        valid = ~np.isnat(values)
        if unit == "D" and count == 1:
            days = values.view(np.int64).astype(np.int32)
            return a.primitive_array(t.date32(), days, valid)
        type_ = t.timestamp(_numpy_unit(values.dtype))  # type: ignore[arg-type]
        return a.primitive_array(type_, values.view(np.int64), valid)
    if kind == "m":
        valid = ~np.isnat(values)
        type_ = t.duration(_numpy_unit(values.dtype))  # type: ignore[arg-type]
        return a.primitive_array(type_, values.view(np.int64), valid)
    if kind == "U":
        return a.binary_like_array(t.string(), [str(v).encode() for v in values])
    if kind == "S":
        return a.binary_like_array(t.binary(), [bytes(v) for v in values])
    if kind == "O":
        return from_objects(list(values))
    raise ArrowNotImplementedError(f"Unsupported numpy type {values.dtype.num}")


# Python objects

_KIND_ORDER = (
    "bool",
    "int",
    "float",
    "decimal",
    "str",
    "bytes",
    "datetime",
    "date",
    "time",
    "timedelta",
    "list",
    "dict",
)


def _kind(value: Any) -> str:
    if isinstance(value, (bool, np.bool_)):
        return "bool"
    if isinstance(value, (int, np.integer)):
        return "int"
    if isinstance(value, (float, np.floating)):
        return "float"
    if isinstance(value, decimal.Decimal):
        return "decimal"
    if isinstance(value, str):
        return "str"
    if isinstance(value, (bytes, bytearray, memoryview)):
        return "bytes"
    if isinstance(value, datetime.datetime):
        return "datetime"
    if isinstance(value, datetime.date):
        return "date"
    if isinstance(value, datetime.time):
        return "time"
    if isinstance(value, datetime.timedelta):
        return "timedelta"
    if isinstance(value, (list, tuple, set, frozenset, np.ndarray)):
        return "list"
    if isinstance(value, dict):
        return "dict"
    return "other"


def _conversion_error(value: Any, type_: t.DataType) -> ArrowInvalid:
    return ArrowInvalid(
        f"Could not convert {value!r} with type {type(value).__name__}: "
        f"tried to convert to {_type_word(type_)}"
    )


def _type_word(type_: t.DataType) -> str:
    if isinstance(type_, t.BoolType):
        return "boolean"
    return str(type_)


def _tz_name(tzinfo: datetime.tzinfo) -> str:
    """The time zone string Arrow records, as pyarrow.lib.tzinfo_to_string."""
    key = getattr(tzinfo, "key", None) or getattr(tzinfo, "zone", None)
    if isinstance(key, str):
        return key
    if tzinfo is datetime.timezone.utc:
        return "UTC"
    offset = tzinfo.utcoffset(None)
    if offset is None:
        raise ArrowInvalid(f"Unsupported time zone {tzinfo!r}")
    sign = "-" if offset < datetime.timedelta(0) else "+"
    minutes = abs(int(offset.total_seconds())) // 60
    return f"{sign}{minutes // 60:02d}:{minutes % 60:02d}"


def _decimal_shape(value: decimal.Decimal) -> tuple[int, int]:
    """(digits before the point, digits after it) of a finite decimal."""
    _, digits, exponent = value.as_tuple()
    assert isinstance(exponent, int)
    if exponent >= 0:
        return len(digits) + exponent, 0
    scale = -exponent
    return max(len(digits) - scale, 0), scale


def infer_type(values: Sequence[Any]) -> t.DataType:
    """The Arrow type pyarrow would infer for these non-null Python values."""
    kinds: dict[str, Any] = {}
    for value in values:
        kind = _kind(value)
        if kind == "other":
            raise ArrowInvalid(
                f"Could not convert {value!r} with type {type(value).__name__}: "
                "did not recognize Python value type when inferring an Arrow "
                "data type"
            )
        kinds.setdefault(kind, value)

    if not kinds:
        return t.null()
    present = set(kinds)

    if present == {"bool"}:
        return t.bool_()
    if present == {"int"}:
        return _int_type(v for v in values)
    if present <= {"int", "float"}:
        return t.float64()
    if present <= {"int", "decimal"}:
        int_digits, scale = 1, 0
        for value in values:
            shape = _decimal_shape(decimal.Decimal(value))
            int_digits = max(int_digits, shape[0])
            scale = max(scale, shape[1])
        return t.decimal128(int_digits + scale, scale)
    if present == {"str"}:
        return t.string()
    if present <= {"str", "bytes"}:
        return t.binary()
    if present == {"datetime"}:
        for value in values:
            if value.tzinfo is not None:
                return t.timestamp("us", _tz_name(value.tzinfo))
        return t.timestamp("us")
    if present <= {"date", "datetime"}:
        return t.date32()
    if present == {"time"}:
        return t.time64("us")
    if present == {"timedelta"}:
        return t.duration("us")
    if present == {"list"}:
        return t.list_(_infer_list_child(values))
    if present == {"dict"}:
        return _infer_struct(values)

    # Incompatible values: pyarrow settles on the type of the first kind in
    # its own order and then fails to convert a value of another kind.
    first = next(k for k in _KIND_ORDER if k in kinds)
    other = next(v for k, v in kinds.items() if k != first)
    first_type = infer_type([kinds[first]])
    if {"str", "bytes"} & present and first in ("str", "bytes"):
        raise ArrowTypeError(f"Expected bytes, got a '{type(other).__name__}' object")
    raise _conversion_error(other, first_type)


def _int_type(values: Iterable[Any]) -> t.IntType:
    for value in values:
        value = int(value)
        if value > _INT64_MAX or value < _INT64_MIN:
            raise OverflowError("Python int too large to convert to C long")
    return t.int64()


def _infer_list_child(values: Sequence[Any]) -> t.DataType:
    items: list[Any] = []
    numpy_types: list[t.DataType] = []
    for value in values:
        if isinstance(value, np.ndarray) and value.dtype.kind != "O":
            numpy_types.append(from_numpy(value[:0]).type)
        else:
            items.extend(v for v in value if not _is_null(v))
    inferred = infer_type(items)
    if not numpy_types:
        return inferred
    candidates = numpy_types + ([] if isinstance(inferred, t.NullType) else [inferred])
    if all(c == candidates[0] for c in candidates):
        return candidates[0]
    if all(isinstance(c, (t.IntType, t.FloatType)) for c in candidates):
        return t.float64()
    raise ArrowInvalid(
        f"Cannot unify list value types {', '.join(map(str, candidates))}"
    )


def _infer_struct(values: Sequence[dict[Any, Any]]) -> t.StructType:
    keys: dict[str, None] = {}
    for value in values:
        for key in value:
            if not isinstance(key, str):
                raise ArrowTypeError(
                    f"Expected dict key of type str or bytes, got '{type(key).__name__}'"
                )
            keys.setdefault(key)
    fields = []
    for key in keys:
        children = [v[key] for v in values if key in v and not _is_null(v[key])]
        fields.append(t.Field(key, infer_type(children)))
    return t.struct(fields)


def from_objects(values: Sequence[Any], type_: t.DataType | None = None) -> a.Array:
    """An Arrow array from Python objects, inferring the type unless given."""
    valid = np.fromiter(
        (not _is_null(v) for v in values), dtype=np.bool_, count=len(values)
    )
    if type_ is None:
        type_ = infer_type([v for v, ok in zip(values, valid) if ok])
    return _build(type_, values, valid)


def _build(type_: t.DataType, values: Sequence[Any], valid: np.ndarray) -> a.Array:
    n = len(values)
    present = [v for v, ok in zip(values, valid) if ok]

    def fill(convert: Any, dtype: Any, default: Any) -> np.ndarray:
        out = np.full(n, default, dtype=dtype)
        for i, (value, ok) in enumerate(zip(values, valid)):
            if ok:
                out[i] = convert(value)
        return out

    if isinstance(type_, t.NullType):
        return a.null_array(n)
    if isinstance(type_, t.BoolType):

        def to_bool(v: Any) -> bool:
            if _kind(v) != "bool":
                raise _conversion_error(v, type_)
            return bool(v)

        return a.bool_array(fill(to_bool, np.bool_, False), valid)
    if isinstance(type_, t.IntType):
        dtype = np.dtype(f"{'i' if type_.signed else 'u'}{type_.bit_width // 8}")

        def to_int(v: Any) -> int:
            if _kind(v) != "int":
                raise _conversion_error(v, type_)
            return int(v)

        return a.primitive_array(type_, fill(to_int, dtype, 0), valid)
    if isinstance(type_, t.FloatType):
        dtype = np.dtype(f"f{type_.bit_width // 8}")

        def to_float(v: Any) -> float:
            if _kind(v) not in ("int", "float"):
                raise _conversion_error(v, type_)
            return float(v)

        return a.primitive_array(type_, fill(to_float, dtype, 0), valid)
    if isinstance(type_, t.StringType):

        def to_str(v: Any) -> bytes:
            if not isinstance(v, str):
                raise ArrowTypeError(
                    f"Expected bytes, got a '{type(v).__name__}' object"
                )
            return v.encode("utf-8")

        return a.binary_like_array(
            type_, [to_str(v) if ok else None for v, ok in zip(values, valid)]
        )
    if isinstance(type_, t.BinaryType):

        def to_bytes(v: Any) -> bytes:
            if isinstance(v, str):
                return v.encode("utf-8")
            if not isinstance(v, (bytes, bytearray, memoryview)):
                raise ArrowTypeError(
                    f"Expected bytes, got a '{type(v).__name__}' object"
                )
            return bytes(v)

        return a.binary_like_array(
            type_, [to_bytes(v) if ok else None for v, ok in zip(values, valid)]
        )
    if isinstance(type_, t.Date32Type):

        def to_days(v: Any) -> int:
            if isinstance(v, datetime.datetime):
                v = v.date()
            if not isinstance(v, datetime.date):
                raise _conversion_error(v, type_)
            return (v - _EPOCH_DATE).days

        return a.primitive_array(type_, fill(to_days, np.int32, 0), valid)
    if isinstance(type_, t.Time64Type):

        def to_time(v: Any) -> int:
            if not isinstance(v, datetime.time):
                raise _conversion_error(v, type_)
            micros = (
                (v.hour * 60 + v.minute) * 60 + v.second
            ) * 1_000_000 + v.microsecond
            return micros if type_.unit == "us" else micros * 1000

        return a.primitive_array(type_, fill(to_time, np.int64, 0), valid)
    if isinstance(type_, t.TimestampType):
        return a.primitive_array(
            type_, fill(lambda v: _timestamp_value(v, type_), np.int64, 0), valid
        )
    if isinstance(type_, t.DurationType):
        return a.primitive_array(
            type_, fill(lambda v: _duration_value(v, type_), np.int64, 0), valid
        )
    if isinstance(type_, t.Decimal128Type):
        return _decimal_array(type_, values, valid)
    if isinstance(type_, t.ListType):
        offsets = np.zeros(n + 1, dtype=np.int64)
        items: list[Any] = []
        for i, (value, ok) in enumerate(zip(values, valid)):
            if ok:
                if _kind(value) != "list":
                    raise _conversion_error(value, type_)
                items.extend(value.tolist() if isinstance(value, np.ndarray) else value)
            offsets[i + 1] = len(items)
        child = from_objects(items, type_.value_type)
        return a.list_array(type_, offsets, child, valid)
    if isinstance(type_, t.StructType):
        children = []
        for f in type_.fields:
            column = [
                value.get(f.name) if ok and isinstance(value, dict) else None
                for value, ok in zip(values, valid)
            ]
            children.append(from_objects(column, f.type))
        for value in present:
            if not isinstance(value, dict):
                raise _conversion_error(value, type_)
        return a.struct_array(type_, children, n, valid)
    raise ArrowNotImplementedError(f"Converting Python objects to {type_}")


def _timestamp_value(value: Any, type_: t.TimestampType) -> int:
    pd = _pandas()
    if pd is not None and isinstance(value, pd.Timestamp):
        nanos = value.value if value.tzinfo is not None or type_.tz is None else None
        if nanos is None:
            nanos = value.tz_localize(None).value
        return _from_nanos(nanos, type_.unit)
    if not isinstance(value, datetime.datetime):
        raise _conversion_error(value, type_)
    if value.tzinfo is not None:
        delta = value - _EPOCH_UTC
    else:
        delta = value - _EPOCH
    micros = delta.days * _US_PER_DAY + delta.seconds * 1_000_000 + delta.microseconds
    return _from_micros(micros, type_.unit)


def _duration_value(value: Any, type_: t.DurationType) -> int:
    pd = _pandas()
    if pd is not None and isinstance(value, pd.Timedelta):
        return _from_nanos(value.value, type_.unit)
    if not isinstance(value, datetime.timedelta):
        raise _conversion_error(value, type_)
    micros = value.days * _US_PER_DAY + value.seconds * 1_000_000 + value.microseconds
    return _from_micros(micros, type_.unit)


_UNIT_PER_SECOND = {"s": 1, "ms": 1000, "us": 1_000_000, "ns": 1_000_000_000}


def _from_micros(micros: int, unit: str) -> int:
    per_second = _UNIT_PER_SECOND[unit]
    if per_second >= 1_000_000:
        return micros * (per_second // 1_000_000)
    return micros // (1_000_000 // per_second)


def _from_nanos(nanos: int, unit: str) -> int:
    return nanos // (1_000_000_000 // _UNIT_PER_SECOND[unit])


def _decimal_array(
    type_: t.Decimal128Type, values: Sequence[Any], valid: np.ndarray
) -> a.Array:
    data = bytearray()
    quantum = decimal.Decimal(1).scaleb(-type_.scale)
    for value, ok in zip(values, valid):
        unscaled = 0
        if ok:
            if _kind(value) not in ("decimal", "int"):
                raise _conversion_error(value, type_)
            exact = decimal.Decimal(value).quantize(
                quantum, context=decimal.Context(prec=type_.precision + 1)
            )
            unscaled = int(exact.scaleb(type_.scale))
        data += unscaled.to_bytes(16, "little", signed=True)
    bitmap, null_count = a.validity(valid, len(values))
    return a.Array(type_, len(values), null_count, [bitmap, bytes(data)])


# pandas


def from_pandas(values: Any) -> a.Array:
    """An Arrow array from a pandas Series or Index, as pyarrow converts it."""
    import pandas as pd

    dtype = values.dtype
    if isinstance(dtype, pd.SparseDtype):
        raise TypeError("Sparse pandas data not supported.")
    if isinstance(dtype, pd.CategoricalDtype):
        return _from_categorical(values)
    if isinstance(dtype, pd.DatetimeTZDtype):
        array = values.array
        type_ = t.timestamp(dtype.unit, _tz_name(dtype.tz))
        return a.primitive_array(type_, array.asi8, ~np.asarray(array.isna()))
    if isinstance(dtype, pd.IntervalDtype):
        return _from_interval(values)
    if isinstance(dtype, pd.PeriodDtype):
        array = values.array
        storage = a.primitive_array(t.int64(), array.asi8, ~np.asarray(array.isna()))
        type_ = t.ExtensionType(
            "pandas.period",
            t.int64(),
            json.dumps({"freq": array.freqstr}).encode(),
        )
        return a.extension_array(type_, storage)
    if isinstance(dtype, pd.StringDtype):
        objects = np.asarray(values.array.to_numpy(dtype=object, na_value=None))
        return from_objects(list(objects), t.string())
    if _is_masked(pd, dtype):
        array = values.array
        valid = ~np.asarray(array.isna())
        numpy_dtype = dtype.numpy_dtype
        data = np.asarray(
            array.to_numpy(dtype=numpy_dtype, na_value=numpy_dtype.type(0))
        )
        if numpy_dtype.kind == "b":
            return a.bool_array(data, valid)
        return a.primitive_array(_numeric_type(numpy_dtype), data, valid)
    if isinstance(dtype, np.dtype):
        return from_numpy(np.asarray(values))
    # Other extension types (e.g. pyarrow-backed ones): go through objects.
    return from_objects(list(values.array.to_numpy(dtype=object)))


def _is_masked(pd: Any, dtype: Any) -> bool:
    return isinstance(
        dtype,
        (
            pd.Int8Dtype,
            pd.Int16Dtype,
            pd.Int32Dtype,
            pd.Int64Dtype,
            pd.UInt8Dtype,
            pd.UInt16Dtype,
            pd.UInt32Dtype,
            pd.UInt64Dtype,
            pd.Float32Dtype,
            pd.Float64Dtype,
            pd.BooleanDtype,
        ),
    )


def _from_categorical(values: Any) -> a.Array:
    cat = values.array
    codes = np.asarray(cat.codes)
    dictionary = from_pandas(cat.categories)
    index_type = t.IntType(codes.dtype.itemsize * 8, True)
    type_ = t.dictionary(index_type, dictionary.type, bool(cat.ordered))
    return a.dictionary_array(type_, codes, codes != -1, dictionary)


def _from_interval(values: Any) -> a.Array:
    array = values.array
    subtype = from_numpy(np.asarray(array.left[:0])).type
    left = from_pandas(array.left)
    right = from_pandas(array.right)
    storage_type = t.struct([t.Field("left", subtype), t.Field("right", subtype)])
    storage = a.struct_array(
        storage_type, [left, right], len(array), ~np.asarray(array.isna())
    )
    type_ = t.ExtensionType(
        "pandas.interval",
        storage_type,
        json.dumps({"subtype": str(subtype), "closed": array.closed}).encode(),
    )
    return a.extension_array(type_, storage)
