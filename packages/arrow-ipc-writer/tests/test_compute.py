"""`take`, `slice_table` and `sort_indices`, checked against pyarrow's own."""

from __future__ import annotations

import datetime
import decimal

import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.compute as pc
import pytest
from test_against_pyarrow import COLUMNS, _pandas_metadata

from arrow_ipc_writer import ArrowException, Table, table_from_pandas, write_stream
from arrow_ipc_writer.compute import slice_table, sort_indices, take_table


def _read(table: Table) -> pa.Table:
    actual = pa.ipc.open_stream(write_stream(table)).read_all()
    actual.validate(full=True)
    return actual


def assert_same_table(table: Table, expected: pa.Table) -> None:
    # `expected` is built first: pyarrow registers pandas' extension types
    # (interval, period) on its first conversion of one, and reading them back
    # before that gives their storage type instead.
    actual = _read(table)
    assert actual.schema.equals(expected.schema, check_metadata=False), (
        f"\n{actual.schema}\n!=\n{expected.schema}"
    )
    assert actual.equals(expected), f"\n{actual}\n!=\n{expected}"
    # Selecting rows leaves the schema, and so the pandas metadata, as it was.
    assert _pandas_metadata(actual) == _pandas_metadata(expected)


# Repeats and reorders rows, so null, offset and dictionary bookkeeping gets
# exercised beyond an identity selection.
TAKE_INDICES = [
    np.array([2, 0, 0, 1], dtype=np.int64),
    np.array([], dtype=np.int64),
    np.array([1], dtype=np.int64),
]


@pytest.mark.parametrize("name", list(COLUMNS))
@pytest.mark.parametrize("indices", TAKE_INDICES, ids=["shuffled", "empty", "one"])
def test_take_column(name: str, indices: np.ndarray) -> None:
    df = pd.DataFrame({name: COLUMNS[name]})
    expected = pa.Table.from_pandas(df).take(indices)
    assert_same_table(take_table(table_from_pandas(df), indices), expected)


def test_take_preserved_index() -> None:
    df = pd.DataFrame(
        {"s": ["a", None, "c"], "c": pd.Categorical(["x", "y", "x"])},
        index=pd.Index([10, 20, 30], name="k"),
    )
    indices = np.array([2, 1], dtype=np.int64)
    expected = pa.Table.from_pandas(df, preserve_index=True).take(indices)
    assert_same_table(
        take_table(table_from_pandas(df, preserve_index=True), indices), expected
    )


def test_take_out_of_bounds() -> None:
    table = table_from_pandas(pd.DataFrame({"a": [1, 2]}))
    with pytest.raises(IndexError):
        take_table(table, np.array([2]))


@pytest.mark.parametrize(
    ("offset", "length"),
    [(0, None), (1, None), (1, 1), (0, 10), (5, 2), (3, 0)],
)
def test_slice(offset: int, length: int | None) -> None:
    df = pd.DataFrame(COLUMNS)
    expected = pa.Table.from_pandas(df).slice(offset, length)
    assert_same_table(slice_table(table_from_pandas(df), offset, length), expected)


def test_many_rows_take() -> None:
    n = 20_000
    rng = np.random.default_rng(0)
    df = pd.DataFrame(
        {
            "i": rng.integers(0, 1000, n),
            "s": pd.Series(rng.integers(0, 50, n)).astype(str).astype(object),
            "l": [[int(v)] * int(v % 3) for v in rng.integers(0, 9, n)],
        }
    )
    indices = rng.permutation(n)
    expected = pa.Table.from_pandas(df).take(indices)
    assert_same_table(take_table(table_from_pandas(df), indices), expected)


_D = decimal.Decimal

# Ties, NaNs and nulls in each, so stability and their placement are checked.
SORTABLE = {
    "int": pd.array([3, None, 1, 3, -2, 1], dtype="Int64"),
    "uint64": np.array([2**63, 1, 2**64 - 1, 1, 0, 7], dtype=np.uint64),
    "float": [3.0, np.nan, None, 1.0, 1.0, -0.5],
    "float_nan_object": pd.Series(
        [1.0, float("nan"), None, 0.0, 1.0, 2.0], dtype=object
    ),
    "float32": np.array([2, np.nan, 1, 2, -1, 0], dtype=np.float32),
    "bool": [True, None, False, True, False, None],
    "str": ["b", "é", None, "a", "Z", "b"],
    "bytes": [b"b", b"\xff", None, b"a", b"", b"b"],
    "datetime_tz": pd.to_datetime(
        ["2024-01-02", None, "2024-01-01", "2024-01-02", "1969-01-01", None]
    ).tz_localize("UTC"),
    "timedelta": pd.to_timedelta([2, None, 1, -3, 2, 0], unit="s"),
    "date": [
        datetime.date(2024, 1, 2),
        None,
        datetime.date(2024, 1, 1),
        datetime.date(1969, 12, 31),
        datetime.date(2024, 1, 2),
        datetime.date(2000, 1, 1),
    ],
    "time": [
        datetime.time(2),
        None,
        datetime.time(1),
        datetime.time(2),
        datetime.time(0, 0, 1),
        datetime.time(23),
    ],
    "decimal": [_D("1.5"), None, _D("-2.25"), _D("1.5"), _D("0"), _D("100")],
    "null": [None] * 6,
    # Sorted field by field, nulls at any level last.
    "struct": [
        {"a": 1, "b": "y"},
        {"a": 0, "b": "z"},
        {"a": 1, "b": "x"},
        None,
        {"a": None, "b": "w"},
        {"a": 0, "b": None},
    ],
    "nested_struct": [
        {"s": {"x": 2.0}},
        {"s": {"x": float("nan")}},
        {"s": None},
        None,
        {"s": {"x": None}},
        {"s": {"x": 1.0}},
    ],
}


@pytest.mark.parametrize("name", list(SORTABLE))
@pytest.mark.parametrize("order", ["ascending", "descending"])
def test_sort_indices(name: str, order: str) -> None:
    df = pd.DataFrame({name: SORTABLE[name]})
    expected = pc.sort_indices(pa.Table.from_pandas(df), sort_keys=[(name, order)])
    actual = sort_indices(table_from_pandas(df), [(name, order)])  # type: ignore[list-item]
    assert actual.tolist() == expected.to_pylist()


def test_sort_by_two_keys() -> None:
    df = pd.DataFrame(
        {"a": [1, 1, None, 0, 1, 0], "b": ["x", "y", "z", None, "x", "w"]}
    )
    keys = [("a", "descending"), ("b", "ascending")]
    expected = pc.sort_indices(pa.Table.from_pandas(df), sort_keys=keys)
    actual = sort_indices(table_from_pandas(df), keys)  # type: ignore[arg-type]
    assert actual.tolist() == expected.to_pylist()


@pytest.mark.parametrize(
    "column",
    [
        pd.Categorical(["b", "a"]),
        np.array([2, 1], dtype=np.float16),
        [[1], [0]],
        [{"l": [1]}, {"l": [0]}],
        pd.arrays.IntervalArray.from_breaks([0, 1, 2]),
        pd.period_range("2024", periods=2, freq="M"),
    ],
    ids=["categorical", "halffloat", "list", "struct_of_list", "interval", "period"],
)
def test_unsortable_columns_raise_as_pyarrow_does(column: object) -> None:
    df = pd.DataFrame({"c": column})
    with pytest.raises(pa.ArrowException) as expected:
        pc.sort_indices(pa.Table.from_pandas(df), sort_keys=[("c", "ascending")])
    with pytest.raises(ArrowException) as actual:
        sort_indices(table_from_pandas(df), [("c", "ascending")])
    assert type(actual.value).__name__ == type(expected.value).__name__


def test_many_rows_sort() -> None:
    n = 50_000
    rng = np.random.default_rng(1)
    floats = rng.random(n)
    floats[rng.integers(0, n, 500)] = np.nan
    df = pd.DataFrame(
        {
            "f": floats,
            "s": pd.Series(rng.integers(0, 200, n)).astype(str).astype(object),
        }
    )
    for name in df.columns:
        for order in ("ascending", "descending"):
            expected = pc.sort_indices(
                pa.Table.from_pandas(df), sort_keys=[(name, order)]
            )
            actual = sort_indices(table_from_pandas(df), [(name, order)])  # type: ignore[list-item]
            assert np.array_equal(actual, expected.to_numpy())
