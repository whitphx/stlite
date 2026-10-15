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


@dataclass
class Table:
    schema: Schema
    columns: list[Array]
    num_rows: int

    def __post_init__(self) -> None:
        if len(self.columns) != len(self.schema.fields):
            raise ValueError("Schema and columns differ in length")
        for f, column in zip(self.schema.fields, self.columns):
            if column.length != self.num_rows:
                raise ValueError(
                    f"Column {f.name!r} has {column.length} rows, "
                    f"expected {self.num_rows}"
                )
