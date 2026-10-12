"""Tables: equal-length columns under a schema."""

from __future__ import annotations

from dataclasses import dataclass, field

from . import types as t
from .array import Array


@dataclass
class Schema:
    fields: list[t.Field]
    metadata: dict[bytes, bytes] = field(default_factory=dict)

    @property
    def names(self) -> list[str]:
        return [f.name for f in self.fields]

    @property
    def types(self) -> list[t.DataType]:
        return [f.type for f in self.fields]

    def field(self, name: str) -> t.Field:
        for f in self.fields:
            if f.name == name:
                return f
        raise KeyError(name)


@dataclass
class Table:
    schema: Schema
    columns: list[Array]
    num_rows: int

    @property
    def column_names(self) -> list[str]:
        return self.schema.names

    @property
    def num_columns(self) -> int:
        return len(self.columns)

    def __post_init__(self) -> None:
        if len(self.columns) != len(self.schema.fields):
            raise ValueError("Schema and columns differ in length")
        for f, column in zip(self.schema.fields, self.columns):
            if column.length != self.num_rows:
                raise ValueError(
                    f"Column {f.name!r} has {column.length} rows, "
                    f"expected {self.num_rows}"
                )
