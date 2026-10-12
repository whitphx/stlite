"""Arrow data types.

Names and string forms follow pyarrow's (`int64`, `timestamp[us, tz=UTC]`,
`dictionary<values=string, indices=int8, ordered=0>`, ...) so results are
easy to compare with it.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

TimeUnit = Literal["s", "ms", "us", "ns"]
TIME_UNITS: tuple[TimeUnit, ...] = ("s", "ms", "us", "ns")


class DataType:
    """Base class of every Arrow type."""

    def __str__(self) -> str:
        raise NotImplementedError


@dataclass(frozen=True)
class NullType(DataType):
    def __str__(self) -> str:
        return "null"


@dataclass(frozen=True)
class BoolType(DataType):
    def __str__(self) -> str:
        return "bool"


@dataclass(frozen=True)
class IntType(DataType):
    bit_width: int
    signed: bool

    def __str__(self) -> str:
        return f"{'' if self.signed else 'u'}int{self.bit_width}"


@dataclass(frozen=True)
class FloatType(DataType):
    bit_width: int  # 16, 32 or 64

    def __str__(self) -> str:
        return {16: "halffloat", 32: "float", 64: "double"}[self.bit_width]


@dataclass(frozen=True)
class StringType(DataType):
    large: bool = False

    def __str__(self) -> str:
        return "large_string" if self.large else "string"


@dataclass(frozen=True)
class BinaryType(DataType):
    large: bool = False

    def __str__(self) -> str:
        return "large_binary" if self.large else "binary"


@dataclass(frozen=True)
class Date32Type(DataType):
    def __str__(self) -> str:
        return "date32[day]"


@dataclass(frozen=True)
class Time64Type(DataType):
    unit: Literal["us", "ns"]

    def __str__(self) -> str:
        return f"time64[{self.unit}]"


@dataclass(frozen=True)
class TimestampType(DataType):
    unit: TimeUnit
    tz: str | None = None

    def __str__(self) -> str:
        if self.tz is None:
            return f"timestamp[{self.unit}]"
        return f"timestamp[{self.unit}, tz={self.tz}]"


@dataclass(frozen=True)
class DurationType(DataType):
    unit: TimeUnit

    def __str__(self) -> str:
        return f"duration[{self.unit}]"


@dataclass(frozen=True)
class Decimal128Type(DataType):
    precision: int
    scale: int

    def __str__(self) -> str:
        return f"decimal128({self.precision}, {self.scale})"


@dataclass(frozen=True)
class Field:
    name: str
    type: DataType
    nullable: bool = True
    metadata: tuple[tuple[str, str], ...] = ()

    def __str__(self) -> str:
        return f"{self.name}: {self.type}"


@dataclass(frozen=True)
class ListType(DataType):
    value_field: Field

    @property
    def value_type(self) -> DataType:
        return self.value_field.type

    def __str__(self) -> str:
        return f"list<{self.value_field}>"


@dataclass(frozen=True)
class StructType(DataType):
    fields: tuple[Field, ...]

    def __str__(self) -> str:
        return "struct<" + ", ".join(str(f) for f in self.fields) + ">"


@dataclass(frozen=True)
class DictionaryType(DataType):
    index_type: IntType
    value_type: DataType
    ordered: bool = False

    def __str__(self) -> str:
        return (
            f"dictionary<values={self.value_type}, indices={self.index_type}, "
            f"ordered={int(self.ordered)}>"
        )


@dataclass(frozen=True)
class ExtensionType(DataType):
    """A type stored as `storage_type`, tagged with an extension name and
    serialized parameters, as pandas' interval and period types are."""

    name: str
    storage_type: DataType
    serialized: bytes = field(default=b"")

    def __str__(self) -> str:
        return f"extension<{self.name}>"


def null() -> NullType:
    return NullType()


def bool_() -> BoolType:
    return BoolType()


def int8() -> IntType:
    return IntType(8, True)


def int16() -> IntType:
    return IntType(16, True)


def int32() -> IntType:
    return IntType(32, True)


def int64() -> IntType:
    return IntType(64, True)


def uint8() -> IntType:
    return IntType(8, False)


def uint16() -> IntType:
    return IntType(16, False)


def uint32() -> IntType:
    return IntType(32, False)


def uint64() -> IntType:
    return IntType(64, False)


def float16() -> FloatType:
    return FloatType(16)


def float32() -> FloatType:
    return FloatType(32)


def float64() -> FloatType:
    return FloatType(64)


def string() -> StringType:
    return StringType()


def large_string() -> StringType:
    return StringType(large=True)


def binary() -> BinaryType:
    return BinaryType()


def large_binary() -> BinaryType:
    return BinaryType(large=True)


def date32() -> Date32Type:
    return Date32Type()


def time64(unit: Literal["us", "ns"]) -> Time64Type:
    return Time64Type(unit)


def timestamp(unit: TimeUnit, tz: str | None = None) -> TimestampType:
    return TimestampType(unit, tz)


def duration(unit: TimeUnit) -> DurationType:
    return DurationType(unit)


def decimal128(precision: int, scale: int = 0) -> Decimal128Type:
    return Decimal128Type(precision, scale)


def list_(value_type: DataType) -> ListType:
    return ListType(Field("item", value_type))


def struct(fields: list[Field] | tuple[Field, ...]) -> StructType:
    return StructType(tuple(fields))


def dictionary(
    index_type: IntType, value_type: DataType, ordered: bool = False
) -> DictionaryType:
    return DictionaryType(index_type, value_type, ordered)
