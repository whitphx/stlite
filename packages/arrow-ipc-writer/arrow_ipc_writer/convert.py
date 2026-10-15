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
from itertools import compress
from typing import Any, Iterable, Sequence

import numpy as np
import pandas as pd

from . import array as a
from . import types as t
from .errors import ArrowInvalid, ArrowNotImplementedError, ArrowTypeError

_EPOCH_DATE = datetime.date(1970, 1, 1)
_EPOCH = datetime.datetime(1970, 1, 1)
_EPOCH_UTC = datetime.datetime(1970, 1, 1, tzinfo=datetime.timezone.utc)
_US_PER_DAY = 86_400_000_000
_UNIT_PER_SECOND = {"s": 1, "ms": 1000, "us": 1_000_000, "ns": 1_000_000_000}

# The largest integer magnitude a double holds exactly.
_MAX_EXACT_DOUBLE_INT = 2**53


def _is_null(value: Any) -> bool:
    """Whether pyarrow, converting with from_pandas=True, makes `value` null."""
    if value is None or value is pd.NA or value is pd.NaT:
        return True
    if isinstance(value, float):  # also np.float64
        return math.isnan(value)
    if isinstance(value, np.floating):
        return bool(np.isnan(value))
    if isinstance(value, (np.datetime64, np.timedelta64)):
        return bool(np.isnat(value))
    if isinstance(value, decimal.Decimal):
        return value.is_nan()
    return False


def _type_name(value: Any) -> str:
    """The type name pyarrow puts in its error messages."""
    cls = type(value)
    if cls.__module__ == "builtins":
        return cls.__qualname__
    return f"{cls.__module__}.{cls.__qualname__}"


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


# numpy


def _numpy_unit(dtype: np.dtype) -> t.TimeUnit:
    unit, count = np.datetime_data(dtype)
    if count != 1 or unit not in t.TIME_UNITS:
        kind = "datetime64" if dtype.kind == "M" else "timedelta64"
        raise ArrowNotImplementedError(f"Unsupported {kind} time unit")
    return unit  # type: ignore[return-value]


def _numeric_type(dtype: np.dtype) -> t.IntType | t.FloatType:
    if dtype.kind in "iu":
        return t.IntType(dtype.itemsize * 8, dtype.kind == "i")
    if dtype.itemsize not in (2, 4, 8):
        raise ArrowNotImplementedError(f"Unsupported numpy type {dtype}")
    return t.FloatType(dtype.itemsize * 8)


def _numpy_type(dtype: np.dtype) -> t.DataType:
    """The Arrow type of a numpy dtype other than object."""
    kind = dtype.kind
    if kind == "b":
        return t.bool_()
    if kind in "iuf":
        return _numeric_type(dtype)
    if kind == "M":
        unit, count = np.datetime_data(dtype)
        if unit == "D" and count == 1:
            return t.date32()
        return t.timestamp(_numpy_unit(dtype))
    if kind == "m":
        return t.duration(_numpy_unit(dtype))
    if kind == "U":
        return t.string()
    if kind == "S":
        return t.binary()
    raise ArrowNotImplementedError(f"Unsupported numpy type {dtype}")


def from_numpy(values: np.ndarray) -> a.Array:
    """An Arrow array from a one-dimensional numpy array."""
    if values.ndim != 1:
        raise ArrowInvalid("only handle 1-dimensional arrays")
    kind = values.dtype.kind
    if kind == "O":
        return from_objects(values)
    type_ = _numpy_type(values.dtype)
    if kind == "b":
        return a.bool_array(values)
    if kind in "iu":
        return a.primitive_array(type_, values)
    if kind == "f":
        return a.primitive_array(type_, values, ~np.isnan(values))
    if kind in "Mm":
        valid = ~np.isnat(values)
        if isinstance(type_, t.Date32Type):
            days = values.view(np.int64).astype(np.int32)
            return a.primitive_array(type_, days, valid)
        return a.primitive_array(type_, values.view(np.int64), valid)
    # tolist() gives str or bytes values for "U" or "S".
    return _build(type_, values.tolist(), np.ones(len(values), dtype=np.bool_))


def _unify_numpy(current: np.dtype | None, new: np.dtype) -> np.dtype:
    """The dtype pyarrow settles on for numpy scalars of both dtypes."""
    if current is None or current == new:
        return new
    kinds = {current.kind, new.kind}
    if len(kinds) == 1 and current.kind in "iuf":
        return max(current, new, key=lambda d: d.itemsize)
    if kinds <= set("iuf") and "f" in kinds:
        return np.dtype(np.float64)
    if len(kinds) == 1 and current.kind in "Mm":
        name = "datetime64" if current.kind == "M" else "timedelta64"
        raise ArrowInvalid(
            f"Cannot mix NumPy {name} units {np.datetime_data(current)[0]} "
            f"and {np.datetime_data(new)[0]}"
        )
    raise ArrowInvalid(f"Cannot mix NumPy dtypes {current} and {new}")


# Inferring the type of Python objects


def _decimal_precision_and_scale(value: decimal.Decimal) -> tuple[int, int]:
    if not value.is_finite():
        raise TypeError(f"Cannot convert {value} to an Arrow decimal")
    _, digits, exponent = value.as_tuple()
    exponent = int(exponent)
    if exponent < 0:
        # Leading zeros, as in 0.01, aren't digits but need precision.
        return max(len(digits), -exponent), -exponent
    return len(digits) + exponent, 0


# When values of several kinds are seen, the first of these present wins.
_KIND_PRIORITY = (
    "float",
    "int",
    "date",
    "time",
    "datetime",
    "timedelta",
    "bool",
    "binary",
    "unicode",
)


class _Inferrer:
    """Infers the Arrow type of Python values the way pyarrow does.

    This follows pyarrow's TypeInferrer (python/pyarrow/src/arrow/python/
    inference.cc). It looks at values in order, and stops at the first value
    of most kinds, which makes the result order-dependent: ["a", 1] is a
    string column, so it fails on 1, while [1, "a"] is an int64 column that
    fails on "a". Only ints, decimals, numpy scalars, lists and dicts let it
    look further, to widen ints to floats or to find a decimal's precision.
    """

    def __init__(self) -> None:
        self.total = 0
        self.nulls = 0
        self.counts: dict[str, int] = {}
        self.timezone: str | None = None
        self.decimal: tuple[int, int] | None = None  # (precision, scale)
        self.numpy_dtype: np.dtype | None = None
        self.numpy_count = 0
        self.list_child: _Inferrer | None = None
        self.struct_children: dict[str, _Inferrer] = {}

    def visit_sequence(self, values: Iterable[Any]) -> None:
        for value in values:
            if not self.visit(value):
                break

    def visit(self, value: Any) -> bool:
        """Records `value`; returns whether pyarrow would look further."""
        self.total += 1
        if _is_null(value):
            self.nulls += 1
            return True
        if isinstance(value, bool):
            kind = "bool"
        elif isinstance(value, float):
            kind = "float"
        elif isinstance(value, int):
            self._count("int")
            return True
        elif isinstance(value, datetime.datetime):
            if "datetime" not in self.counts and value.tzinfo is not None:
                self.timezone = _tz_name(value.tzinfo)
            kind = "datetime"
        elif isinstance(value, datetime.timedelta):
            kind = "timedelta"
        elif isinstance(value, datetime.date):
            kind = "date"
        elif isinstance(value, datetime.time):
            kind = "time"
        elif isinstance(value, (bytes, bytearray, memoryview)):
            kind = "binary"
        elif isinstance(value, str):
            kind = "unicode"
        elif isinstance(value, np.generic):
            self._visit_dtype(value.dtype)
            return True
        elif isinstance(value, np.ndarray):
            self._visit_ndarray(value)
            return True
        elif isinstance(value, (list, tuple, set)):
            self._list_child().visit_sequence(value)
            self._count("list")
            return True
        elif isinstance(value, dict):
            self._visit_dict(value)
            return True
        elif isinstance(value, decimal.Decimal):
            self._visit_decimal(value)
            return True
        else:
            raise ArrowInvalid(
                f"Could not convert {value!r} with type {_type_name(value)}: "
                "did not recognize Python value type when inferring an Arrow "
                "data type"
            )
        self._count(kind)
        return False

    def _count(self, kind: str) -> None:
        self.counts[kind] = self.counts.get(kind, 0) + 1

    def _visit_dtype(self, dtype: np.dtype) -> None:
        self.numpy_dtype = _unify_numpy(self.numpy_dtype, dtype)
        self.numpy_count += 1

    def _list_child(self) -> _Inferrer:
        if self.list_child is None:
            self.list_child = _Inferrer()
        return self.list_child

    def _visit_ndarray(self, value: np.ndarray) -> None:
        if value.ndim != 1:
            raise ArrowInvalid("Can only convert 1-dimensional array values")
        child = self._list_child()
        if value.dtype.kind == "O":
            child.visit_sequence(value)
        else:
            child.total += 1
            child._visit_dtype(value.dtype)
        self._count("list")

    def _visit_dict(self, value: dict[Any, Any]) -> None:
        for key, item in value.items():
            if isinstance(key, bytes):
                key = key.decode("utf-8")
            elif not isinstance(key, str):
                raise ArrowTypeError(
                    "Expected dict key of type str or bytes, got "
                    f"'{type(key).__name__}'"
                )
            child = self.struct_children.setdefault(key, _Inferrer())
            child.visit(item)
        self._count("struct")

    def _visit_decimal(self, value: decimal.Decimal) -> None:
        precision, scale = _decimal_precision_and_scale(value)
        if self.decimal is not None:
            current_precision, current_scale = self.decimal
            new_scale = max(current_scale, scale)
            digits = max(current_precision - current_scale, precision - scale)
            precision = max(digits + new_scale, current_precision)
            scale = new_scale
        self.decimal = (precision, scale)
        self._count("decimal")

    def _validate(self) -> None:
        for kind in ("list", "struct"):
            count = self.counts.get(kind)
            if count is not None and count + self.nulls != self.total:
                raise ArrowInvalid(f"cannot mix {kind} and non-{kind}, non-null values")

    def get_type(self) -> t.DataType:
        self._validate()
        counts = dict(self.counts)
        if self.numpy_dtype is not None:
            dtype = self.numpy_dtype
            if self.numpy_count + self.nulls == self.total:
                return _numpy_type(dtype)
            if dtype.kind in "Mm":
                name = "datetime64" if dtype.kind == "M" else "timedelta64"
                raise ArrowInvalid(
                    f"numpy.{name} scalars cannot be mixed with other Python "
                    "scalar values currently"
                )
            kind = {"b": "bool", "i": "int", "u": "int", "f": "float"}.get(dtype.kind)
            if kind is None:
                raise ArrowInvalid(f"Cannot mix NumPy dtype {dtype} with other values")
            counts[kind] = counts.get(kind, 0) + self.numpy_count
        if "list" in counts:
            return t.list_(self._list_child().get_type())
        if "struct" in counts:
            return t.struct(
                [t.Field(k, c.get_type()) for k, c in self.struct_children.items()]
            )
        if self.decimal is not None:
            precision, scale = self.decimal
            if precision > t.DECIMAL256_MAX_PRECISION:
                raise ArrowInvalid(f"Decimal precision {precision} is out of range")
            return t.decimal(precision, scale)
        for kind in _KIND_PRIORITY:
            if kind in counts:
                return _KIND_TYPES[kind](self)
        return t.null()


_KIND_TYPES: dict[str, Any] = {
    "float": lambda _: t.float64(),
    "int": lambda _: t.int64(),
    "date": lambda _: t.date32(),
    "time": lambda _: t.time64("us"),
    "datetime": lambda inferrer: t.timestamp("us", inferrer.timezone),
    "timedelta": lambda _: t.duration("us"),
    "bool": lambda _: t.bool_(),
    "binary": lambda _: t.binary(),
    "unicode": lambda _: t.string(),
}


def infer_type(values: Iterable[Any]) -> t.DataType:
    """The Arrow type pyarrow would infer for these Python values."""
    inferrer = _Inferrer()
    inferrer.visit_sequence(values)
    return inferrer.get_type()


# Converting Python objects to a type

# A column's values: a list, or a one-dimensional object ndarray as pandas
# hands them over, which saves copying them into a list.
Values = Sequence[Any] | np.ndarray


def _conversion_error(value: Any, type_: t.DataType) -> ArrowInvalid:
    target = "boolean" if isinstance(type_, t.BoolType) else str(type_)
    return ArrowInvalid(
        f"Could not convert {value!r} with type {_type_name(value)}: "
        f"tried to convert to {target}"
    )


def _raw_int(value: Any) -> int:
    """A number given for a temporal value, taken as its raw count of units."""
    if isinstance(value, (int, float, np.integer, np.floating)):
        return int(value)
    raise ArrowTypeError(f"object of type {type(value)!r} cannot be converted to int")


def _to_bool(value: Any, type_: t.DataType) -> bool:
    if isinstance(value, (bool, np.bool_)):
        return bool(value)
    raise _conversion_error(value, type_)


def _to_int(value: Any, type_: t.IntType) -> int:
    if isinstance(value, bool):
        raise ArrowTypeError("Expected integer, got bool")
    if not isinstance(value, (int, np.integer, np.bool_)):
        raise _conversion_error(value, type_)
    result = int(value)
    if type_.signed:
        low, high = -(2 ** (type_.bit_width - 1)), 2 ** (type_.bit_width - 1) - 1
    else:
        low, high = 0, 2**type_.bit_width - 1
    if not low <= result <= high:
        raise OverflowError("Python int too large to convert to C long")
    return result


def _to_float(value: Any, type_: t.FloatType) -> float:
    if isinstance(value, (float, np.floating)):
        return float(value)
    if isinstance(value, (int, np.integer)):  # bool too, but not np.bool_
        result = int(value)
        if abs(result) > _MAX_EXACT_DOUBLE_INT:
            raise ArrowInvalid(
                f"Integer value {result} is outside of the range exactly "
                "representable by a IEEE 754 double precision value"
            )
        return float(result)
    raise _conversion_error(value, type_)


def _to_days(value: Any) -> int:
    if isinstance(value, datetime.datetime):
        value = value.date()
    if isinstance(value, datetime.date):
        return (value - _EPOCH_DATE).days
    if isinstance(value, np.datetime64):
        return int(value.astype("datetime64[D]").astype(np.int64))
    return _raw_int(value)


def _to_time(value: Any, type_: t.Time64Type) -> int:
    if not isinstance(value, datetime.time):
        return _raw_int(value)
    micros = (
        (value.hour * 60 + value.minute) * 60 + value.second
    ) * 1_000_000 + value.microsecond
    return micros if type_.unit == "us" else micros * 1000


def _to_timestamp(value: Any, type_: t.TimestampType) -> int:
    if isinstance(value, pd.Timestamp):
        # .value counts from the epoch in UTC for an aware Timestamp and in
        # wall time for a naive one, as below.
        return _from_nanos(value.value, type_.unit)
    if isinstance(value, datetime.datetime):
        if value.tzinfo is not None:
            delta = value - _EPOCH_UTC
        else:
            delta = value - _EPOCH
        return _from_micros(_micros(delta), type_.unit)
    if isinstance(value, np.datetime64):
        return int(value.astype(f"datetime64[{type_.unit}]").astype(np.int64))
    return _raw_int(value)


def _to_duration(value: Any, type_: t.DurationType) -> int:
    if isinstance(value, pd.Timedelta):
        return _from_nanos(value.value, type_.unit)
    if isinstance(value, datetime.timedelta):
        return _from_micros(_micros(value), type_.unit)
    if isinstance(value, np.timedelta64):
        return int(value.astype(f"timedelta64[{type_.unit}]").astype(np.int64))
    return _raw_int(value)


def _micros(delta: datetime.timedelta) -> int:
    return delta.days * _US_PER_DAY + delta.seconds * 1_000_000 + delta.microseconds


def _from_micros(micros: int, unit: str) -> int:
    per_second = _UNIT_PER_SECOND[unit]
    if per_second >= 1_000_000:
        return micros * (per_second // 1_000_000)
    return micros // (1_000_000 // per_second)


def _from_nanos(nanos: int, unit: str) -> int:
    return nanos // (1_000_000_000 // _UNIT_PER_SECOND[unit])


def _to_unscaled_decimal(value: Any, type_: t.DecimalType) -> int:
    """`value` times 10**scale, as the integer a decimal array stores."""
    if isinstance(value, bool):
        raise ArrowInvalid(f"The string '{value}' is not a valid {type_} number")
    if isinstance(value, (int, np.integer)):
        result = int(value)
        digits = len(str(abs(result)))
        if digits > type_.precision - type_.scale:
            raise ArrowInvalid(
                f"Decimal type with precision {digits + type_.scale} does not fit "
                f"into precision inferred from first array element: "
                f"{type_.precision}"
            )
        return result * 10**type_.scale
    if isinstance(value, decimal.Decimal):
        if not value.is_finite():
            raise TypeError(f"Cannot convert {value} to an Arrow decimal")
        sign, digit_tuple, exponent = value.as_tuple()
        unscaled = int("".join(map(str, digit_tuple)) or "0")
        shift = int(exponent) + type_.scale
        if shift < 0:
            raise ArrowInvalid(f"{value} does not fit {type_} without rounding")
        result = unscaled * 10**shift
        if len(str(result)) > type_.precision:
            raise ArrowInvalid(f"{value} does not fit {type_}")
        return -result if sign else result
    raise ArrowTypeError(f"int or Decimal object expected, got {_type_name(value)}")


def _to_bytes(value: Any) -> tuple[bytes, bool]:
    """The value's bytes, and whether it was given as bytes rather than str."""
    if isinstance(value, str):
        return value.encode("utf-8"), False
    if isinstance(value, (bytes, bytearray, memoryview)):
        return bytes(value), True
    raise ArrowTypeError(f"Expected bytes, got a '{_type_name(value)}' object")


def _dict_item(value: dict[Any, Any], key: str) -> Any:
    if key in value:
        return value[key]
    return value.get(key.encode("utf-8"))


def _valid_mask(values: Values) -> np.ndarray:
    """~_is_null over `values`, in one pass in C: pd.isna treats the same
    values as null (None, NaN, NaT, pd.NA and Decimal NaN)."""
    if isinstance(values, np.ndarray) and values.dtype == object:
        objects = values
    else:
        objects = np.fromiter(values, dtype=object, count=len(values))
    return ~pd.isna(objects)


def _encode_strings(
    values: Values, valid: np.ndarray
) -> tuple[np.ndarray, bytes, bool] | None:
    """Offsets, data, and whether they were bytes, for values that are all
    str or all bytes, encoded in bulk; None for anything else, which the
    per-value path handles (and reports errors on) instead."""
    present = list(compress(values, valid))
    kinds = set(map(type, present))
    if kinds <= {str}:
        joined = "".join(present)
        data = joined.encode("utf-8")
        lengths = a.lengths_of(present)  # in characters
        if len(data) != len(joined):
            lengths = _utf8_lengths(data, lengths)
        return a.value_offsets(lengths, valid), data, False
    if kinds == {bytes}:
        return a.value_offsets(a.lengths_of(present), valid), b"".join(present), True
    return None


def _utf8_lengths(data: bytes, char_lengths: np.ndarray) -> np.ndarray:
    """Byte lengths of consecutive strings in `data`, UTF-8 encoded, from
    their lengths in characters. Every character starts with a byte that
    isn't a continuation byte (0b10xxxxxx), so the n-th such byte is where
    the n-th character starts."""
    buffer = np.frombuffer(data, dtype=np.uint8)
    char_starts = np.append(np.flatnonzero((buffer & 0xC0) != 0x80), len(data))
    char_offsets = np.zeros(len(char_lengths) + 1, dtype=np.int64)
    np.cumsum(char_lengths, out=char_offsets[1:])
    return np.diff(char_starts[char_offsets])


def from_objects(values: Values, type_: t.DataType | None = None) -> a.Array:
    """An Arrow array from Python objects, inferring the type unless given."""
    valid = _valid_mask(values)
    if type_ is None:
        type_ = infer_type(values)
    return _build(type_, values, valid)


def _build(type_: t.DataType, values: Values, valid: np.ndarray) -> a.Array:
    """Converts the valid values in row order, so the first value that doesn't
    fit `type_` is the one that fails, as in pyarrow."""
    n = len(values)

    def fill(convert: Any, dtype: Any) -> np.ndarray:
        out = np.zeros(n, dtype=dtype)
        for i, (value, ok) in enumerate(zip(values, valid)):
            if ok:
                out[i] = convert(value)
        return out

    if isinstance(type_, t.NullType):
        return a.null_array(n)
    if isinstance(type_, t.BoolType):
        return a.bool_array(fill(lambda v: _to_bool(v, type_), np.bool_), valid)
    if isinstance(type_, t.IntType):
        dtype = np.dtype(f"{'i' if type_.signed else 'u'}{type_.bit_width // 8}")
        return a.primitive_array(type_, fill(lambda v: _to_int(v, type_), dtype), valid)
    if isinstance(type_, t.FloatType):
        dtype = np.dtype(f"f{type_.bit_width // 8}")
        return a.primitive_array(
            type_, fill(lambda v: _to_float(v, type_), dtype), valid
        )
    if isinstance(type_, (t.StringType, t.BinaryType)):
        # pyarrow's string builder takes bytes too, but then makes the whole
        # array binary.
        bulk = _encode_strings(values, valid)
        if bulk is not None:
            offsets, data, is_bytes = bulk
            return a.binary_array(
                t.binary() if is_bytes else type_, offsets, data, valid
            )
        encoded: list[bytes | None] = []
        saw_bytes = False
        for value, ok in zip(values, valid):
            if ok:
                data, is_bytes = _to_bytes(value)
                encoded.append(data)
                saw_bytes = saw_bytes or is_bytes
            else:
                encoded.append(None)
        return a.binary_like_array(t.binary() if saw_bytes else type_, encoded)
    if isinstance(type_, t.Date32Type):
        return a.primitive_array(type_, fill(_to_days, np.int32), valid)
    if isinstance(type_, t.Time64Type):
        return a.primitive_array(
            type_, fill(lambda v: _to_time(v, type_), np.int64), valid
        )
    if isinstance(type_, t.TimestampType):
        return a.primitive_array(
            type_, fill(lambda v: _to_timestamp(v, type_), np.int64), valid
        )
    if isinstance(type_, t.DurationType):
        return a.primitive_array(
            type_, fill(lambda v: _to_duration(v, type_), np.int64), valid
        )
    if isinstance(type_, t.DecimalType):
        width = type_.bit_width // 8
        data = b"".join(
            (_to_unscaled_decimal(v, type_) if ok else 0).to_bytes(
                width, "little", signed=True
            )
            for v, ok in zip(values, valid)
        )
        bitmap, null_count = a.validity(valid, n)
        return a.Array(type_, n, null_count, [bitmap, data])
    if isinstance(type_, t.ListType):
        offsets = np.zeros(n + 1, dtype=np.int64)
        items: list[Any] = []
        for i, (value, ok) in enumerate(zip(values, valid)):
            if ok:
                if not isinstance(value, (list, tuple, set, np.ndarray)):
                    raise _conversion_error(value, type_)
                # list() keeps numpy scalars (np.datetime64 and the like),
                # where .tolist() would drop their units.
                items.extend(list(value))
            offsets[i + 1] = len(items)
        child = from_objects(items, type_.value_type)
        return a.list_array(t.list_(child.type), offsets, child, valid)
    if isinstance(type_, t.StructType):
        for value, ok in zip(values, valid):
            if ok and not isinstance(value, dict):
                raise _conversion_error(value, type_)
        children = [
            from_objects(
                [
                    _dict_item(value, f.name) if ok else None
                    for value, ok in zip(values, valid)
                ],
                f.type,
            )
            for f in type_.fields
        ]
        struct_type = t.struct(
            [t.Field(f.name, child.type) for f, child in zip(type_.fields, children)]
        )
        return a.struct_array(struct_type, children, n, valid)
    raise ArrowNotImplementedError(f"Converting Python objects to {type_}")


# pandas


def from_pandas(values: Any) -> a.Array:
    """An Arrow array from a pandas Series or Index, as pyarrow converts it."""
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
        return from_objects(objects, t.string())
    if _is_masked(dtype):
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
    return from_objects(np.asarray(values.array.to_numpy(dtype=object)))


_MASKED_DTYPES = (
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
)


def _is_masked(dtype: Any) -> bool:
    return isinstance(dtype, _MASKED_DTYPES)


def _from_categorical(values: Any) -> a.Array:
    cat = values.array
    codes = np.asarray(cat.codes)
    dictionary = from_pandas(cat.categories)
    index_type = t.IntType(codes.dtype.itemsize * 8, True)
    type_ = t.dictionary(index_type, dictionary.type, bool(cat.ordered))
    return a.dictionary_array(type_, codes, codes != -1, dictionary)


def _from_interval(values: Any) -> a.Array:
    array = values.array
    if isinstance(array.left.dtype, pd.DatetimeTZDtype):
        # pandas' own ArrowIntervalType rejects these too.
        raise TypeError("Intervals of tz-aware datetimes can't be converted")
    left = from_pandas(array.left)
    right = from_pandas(array.right)
    subtype = left.type
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
