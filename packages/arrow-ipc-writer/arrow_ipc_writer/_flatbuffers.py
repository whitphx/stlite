"""A minimal FlatBuffers builder, enough to encode Arrow IPC metadata.

It follows the reference implementations: the buffer is built back to front,
so every child object (string, vector, table) is finished before the parent
that points to it, and references are unsigned offsets that point forward.
"""

from __future__ import annotations

import struct
from typing import Sequence

# Offsets below are measured from the end of the buffer being built (the
# position an object will keep however much is prepended later), as in the
# reference builders.


class Builder:
    def __init__(self) -> None:
        self._buf = bytearray()
        self._minalign = 1
        self._vtable: list[int] | None = None
        self._object_start = 0

    def offset(self) -> int:
        return len(self._buf)

    def _prepend(self, data: bytes) -> None:
        self._buf[0:0] = data

    def _pad(self, n: int) -> None:
        if n:
            self._prepend(b"\x00" * n)

    def _prep(self, size: int, additional: int) -> None:
        """Align so that `size`-byte data can follow `additional` more bytes."""
        self._minalign = max(self._minalign, size)
        self._pad((-(len(self._buf) + additional)) % size)

    def _prepend_scalar(self, fmt: str, value: object) -> None:
        size = struct.calcsize(fmt)
        self._prep(size, 0)
        self._prepend(struct.pack(fmt, value))

    def _prepend_uoffset(self, off: int) -> None:
        self._prep(4, 0)
        # The offset is relative to where it is stored, which is 4 bytes
        # beyond the current end once it is written.
        self._prepend(struct.pack("<I", self.offset() - off + 4))

    # Strings and vectors

    def create_string(self, value: str | bytes) -> int:
        data = value.encode("utf-8") if isinstance(value, str) else value
        self._prep(4, len(data) + 1)
        self._prepend(data + b"\x00")
        self._prepend(struct.pack("<I", len(data)))
        return self.offset()

    def create_offset_vector(self, offsets: Sequence[int]) -> int:
        self._prep(4, 4 * len(offsets))
        for off in reversed(offsets):
            self._prepend_uoffset(off)
        self._prepend(struct.pack("<I", len(offsets)))
        return self.offset()

    def create_struct_vector(
        self, fmt: str, alignment: int, items: Sequence[tuple[object, ...]]
    ) -> int:
        """A vector of structs, each packed with `fmt` (no padding inside)."""
        size = struct.calcsize(fmt)
        self._prep(4, size * len(items))
        self._prep(alignment, size * len(items))
        for item in reversed(items):
            self._prepend(struct.pack(fmt, *item))
        self._prep(4, 0)
        self._prepend(struct.pack("<I", len(items)))
        return self.offset()

    # Tables

    def start_table(self, num_fields: int) -> None:
        if self._vtable is not None:
            raise RuntimeError("Tables cannot be nested while building")
        self._vtable = [0] * num_fields
        self._object_start = self.offset()

    def _slot(self, index: int) -> None:
        assert self._vtable is not None
        self._vtable[index] = self.offset()

    def add_scalar(self, index: int, fmt: str, value: object, default: object) -> None:
        if value == default:
            return
        self._prepend_scalar(fmt, value)
        self._slot(index)

    def add_offset(self, index: int, off: int | None) -> None:
        if off is None:
            return
        self._prepend_uoffset(off)
        self._slot(index)

    def end_table(self) -> int:
        assert self._vtable is not None
        # The table starts with a signed offset to its vtable, patched below.
        self._prepend_scalar("<i", 0)
        object_offset = self.offset()

        fields = self._vtable
        while fields and fields[-1] == 0:
            fields = fields[:-1]
        entries = [object_offset - loc if loc else 0 for loc in fields]
        vtable = struct.pack(
            f"<HH{len(entries)}H",
            4 + 2 * len(entries),
            object_offset - self._object_start,
            *entries,
        )
        self._prepend(vtable)
        vtable_offset = self.offset()

        # vtable position = table position - soffset; the vtable sits before
        # the table, so the soffset is positive.
        struct.pack_into(
            "<i",
            self._buf,
            len(self._buf) - object_offset,
            vtable_offset - object_offset,
        )
        self._vtable = None
        return object_offset

    def finish(self, root: int) -> bytes:
        self._prep(self._minalign, 4)
        self._prepend_uoffset(root)
        return bytes(self._buf)
