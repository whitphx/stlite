"""Every case is serialized here and read back with pyarrow, then compared
with what `pyarrow.Table.from_pandas` builds from the same DataFrame."""

from __future__ import annotations

import datetime
import decimal
import json
import zoneinfo

import numpy as np
import pandas as pd
import pyarrow as pa
import pytest

from arrow_ipc_writer import ArrowException, dataframe_to_ipc


def _pandas_metadata(table: pa.Table) -> dict:
    metadata = json.loads(table.schema.metadata[b"pandas"])
    del metadata["creator"]
    return metadata


def assert_matches_pyarrow(
    df: pd.DataFrame, preserve_index: bool | None = None
) -> None:
    expected = pa.Table.from_pandas(df, preserve_index=preserve_index)
    actual = pa.ipc.open_stream(dataframe_to_ipc(df, preserve_index)).read_all()

    assert actual.schema.equals(expected.schema, check_metadata=False), (
        f"\n{actual.schema}\n!=\n{expected.schema}"
    )
    assert actual.equals(expected), f"\n{actual}\n!=\n{expected}"
    assert _pandas_metadata(actual) == _pandas_metadata(expected)


COLUMNS = {
    "int8": np.array([1, -2, 3], dtype=np.int8),
    "int64": np.array([1, 2, 3], dtype=np.int64),
    "uint32": np.array([1, 2, 3], dtype=np.uint32),
    "uint64_large": np.array([2**63, 0, 1], dtype=np.uint64),
    "float16": np.array([1, np.nan, 3], dtype=np.float16),
    "float32": np.array([1.5, np.nan, 3], dtype=np.float32),
    "float64": [1.5, None, 3.0],
    "bool": [True, False, True],
    "Int8": pd.array([1, None, 3], dtype="Int8"),
    "UInt64": pd.array([1, None, 3], dtype="UInt64"),
    "Float64": pd.array([1.5, None, np.nan], dtype="Float64"),
    "boolean": pd.array([True, None, False], dtype="boolean"),
    "bool_object": pd.Series([True, None, False], dtype=object),
    "str_object": pd.Series(["a", None, "c"], dtype=object),
    "str_default": ["a", None, "c"],
    "string_python": pd.array(["a", None, "c"], dtype=pd.StringDtype("python")),
    "unicode_numpy": np.array(["a", "bc", ""]),
    "bytes_object": [b"a", None, b"c"],
    "bytes_numpy": np.array([b"a", b"bc", b""]),
    "str_and_bytes": pd.Series(["a", b"b", None], dtype=object),
    "datetime": pd.to_datetime(["2024-01-01 00:00:00", None, "2024-01-03 04:05:06"]),
    "datetime_ns": pd.to_datetime(["2024-01-01", None, "2024-01-03"]).as_unit("ns"),
    "datetime_s": pd.to_datetime(["2024-01-01", None, "2024-01-03"]).as_unit("s"),
    "datetime_tz": pd.date_range("2024-01-01", periods=3, tz="Asia/Tokyo"),
    "datetime_utc": pd.date_range("2024-01-01", periods=3, tz="UTC"),
    "datetime_fixed_offset": pd.date_range(
        "2024-01-01", periods=3, tz=datetime.timezone(datetime.timedelta(hours=-5))
    ),
    # pandas coerces units it doesn't support to the nearest one it does ([s]).
    "datetime64_minutes": np.array(
        ["2024-01-01T00:00", "NaT", "1969-12-31T23:59"], dtype="datetime64[m]"
    ),
    "datetime64_D": np.array(
        ["2024-01-01", "NaT", "1969-12-31"], dtype="datetime64[D]"
    ),
    "timedelta": pd.to_timedelta([1, None, 3], unit="s"),
    "timedelta_ns": pd.to_timedelta([1, None, 3], unit="ns"),
    "py_datetime": pd.Series(
        [
            datetime.datetime(2024, 1, 1, 1, 2, 3, 4),
            None,
            datetime.datetime(1960, 5, 6),
        ],
        dtype=object,
    ),
    "py_datetime_tz": pd.Series(
        [
            datetime.datetime(2024, 1, 1, tzinfo=zoneinfo.ZoneInfo("Asia/Tokyo")),
            datetime.datetime(2024, 1, 1, tzinfo=datetime.timezone.utc),
            None,
        ],
        dtype=object,
    ),
    "pd_timestamp_object": pd.Series(
        [pd.Timestamp("2024-01-01 00:00:00.123456"), None, pd.Timestamp("2000-01-01")],
        dtype=object,
    ),
    "py_timedelta": pd.Series(
        [
            datetime.timedelta(seconds=1, microseconds=5),
            None,
            datetime.timedelta(days=-2),
        ],
        dtype=object,
    ),
    "date": [datetime.date(2024, 1, 1), None, datetime.date(1900, 1, 3)],
    "date_and_datetime": pd.Series(
        [datetime.date(2024, 1, 1), datetime.datetime(2024, 1, 2, 3, 4), None],
        dtype=object,
    ),
    "time": [datetime.time(1, 2, 3), None, datetime.time(23, 59, 59, 999999)],
    "decimal": [decimal.Decimal("1.23"), None, decimal.Decimal("-45.6")],
    "decimal_exponent": [decimal.Decimal("1E+3"), decimal.Decimal("0.001"), None],
    "decimal_and_int": pd.Series([decimal.Decimal("1"), 2, None], dtype=object),
    "categorical": pd.Categorical(["x", "y", "x"]),
    "categorical_ordered_with_nan": pd.Categorical(
        ["x", "y", None], categories=["y", "x"], ordered=True
    ),
    "categorical_ints": pd.Categorical([3, 1, 3]),
    "interval": pd.interval_range(0, 3),
    "interval_float_with_na": pd.arrays.IntervalArray(
        [pd.Interval(0.5, 1.5), np.nan, pd.Interval(2.0, 3.0)]
    ),
    "interval_closed_left": pd.interval_range(0, 3, closed="left"),
    "period": pd.period_range("2024-01", periods=3, freq="M"),
    "period_with_nat": pd.PeriodIndex(["2024-01-01", None, "2024-01-03"], freq="D"),
    "list": [[1, 2], None, [3]],
    "list_of_numpy": [np.array([1, 2]), np.array([3]), np.array([], dtype=float)],
    "list_of_str": [["a", None], [], None],
    "tuple": [(1, 2), (3,), None],
    "set": [{1, 2}, {3}, None],
    "nested_list": [[[1], [2, 3]], None, [[]]],
    "dict": [{"a": 1}, {"a": 2, "b": "x"}, None],
    "nested_dict": [{"a": {"b": [1, 2]}}, {"a": None}, None],
    "all_none": [None, None, None],
    "int_and_float_objects": pd.Series([1, 2.5, None], dtype=object),
    "numpy_scalars_object": pd.Series([np.int32(1), np.int64(2), None], dtype=object),
    "float_nan_object": pd.Series([1.0, float("nan"), None], dtype=object),
}


@pytest.mark.parametrize("name", list(COLUMNS))
def test_column(name: str) -> None:
    assert_matches_pyarrow(pd.DataFrame({name: COLUMNS[name]}))


def test_all_columns_together() -> None:
    assert_matches_pyarrow(pd.DataFrame(COLUMNS))


@pytest.mark.parametrize(
    "index",
    [
        pd.RangeIndex(3),
        pd.RangeIndex(10, 16, 2, name="r"),
        pd.Index(["a", "b", "c"], name="letters"),
        pd.Index([10, 20, 30]),
        pd.DatetimeIndex(["2024-01-01", "2024-01-02", "2024-01-03"], name="when"),
        pd.MultiIndex.from_tuples([("a", 1), ("a", 2), ("b", 1)], names=["k", None]),
        pd.CategoricalIndex(["x", "y", "x"]),
        pd.Index(["a", "b", "c"], name="value"),  # collides with a column name
    ],
)
@pytest.mark.parametrize("preserve_index", [None, True, False])
def test_index(index: pd.Index, preserve_index: bool | None) -> None:
    df = pd.DataFrame({"value": [1, 2, 3]}, index=index)
    assert_matches_pyarrow(df, preserve_index=preserve_index)


@pytest.mark.parametrize(
    "columns",
    [
        pd.Index([1, 2]),
        pd.Index(["a", "b"], name="names"),
        pd.MultiIndex.from_tuples([("a", "x"), ("a", "y")], names=["top", "bottom"]),
        pd.Index([datetime.date(2024, 1, 1), datetime.date(2024, 1, 2)]),
    ],
)
def test_column_labels(columns: pd.Index) -> None:
    assert_matches_pyarrow(pd.DataFrame([[1, 2], [3, 4]], columns=columns))


def test_empty_frames() -> None:
    assert_matches_pyarrow(pd.DataFrame())
    assert_matches_pyarrow(pd.DataFrame({"a": pd.Series([], dtype="int64")}))
    assert_matches_pyarrow(pd.DataFrame({"a": pd.Series([], dtype=object)}))
    assert_matches_pyarrow(pd.DataFrame(index=pd.RangeIndex(5)))


def test_attrs() -> None:
    df = pd.DataFrame({"a": [1]})
    df.attrs = {"source": "test"}
    assert_matches_pyarrow(df)


def test_many_rows() -> None:
    n = 100_000
    rng = np.random.default_rng(0)
    df = pd.DataFrame(
        {
            "i": rng.integers(0, 1000, n),
            "f": rng.random(n),
            "s": pd.Series(rng.integers(0, 50, n)).astype(str).astype(object),
            "c": pd.Categorical(rng.choice(["a", "b", "c"], n)),
        }
    )
    assert_matches_pyarrow(df)


ERROR_COLUMNS = {
    "mixed_int_str": pd.Series([1, "a", 2.0], dtype=object),
    "str_then_int": pd.Series(["a", 1], dtype=object),
    "bool_and_int": pd.Series([True, 1], dtype=object),
    "tuple_mixed": [(1, "a"), (2, "b"), None],
    "complex": np.array([1 + 2j, 3j]),
    "unknown_object": pd.Series([object()], dtype=object),
    "int_overflow": pd.Series([2**64, 1], dtype=object),
}


@pytest.mark.parametrize("name", list(ERROR_COLUMNS))
def test_unconvertible_column(name: str) -> None:
    df = pd.DataFrame({name: ERROR_COLUMNS[name]})
    with pytest.raises((pa.ArrowException, OverflowError, TypeError)):
        pa.Table.from_pandas(df)
    with pytest.raises((ArrowException, OverflowError, TypeError)):
        dataframe_to_ipc(df)


@pytest.mark.parametrize(
    "values",
    [
        np.array(["2024-01-01T00:00"], dtype="datetime64[m]"),
        np.array([1 + 2j]),
        np.array([[1, 2]]),
    ],
)
def test_unconvertible_numpy_array(values: np.ndarray) -> None:
    from arrow_ipc_writer.convert import from_numpy

    with pytest.raises(pa.ArrowException) as expected:
        pa.array(values, from_pandas=True)
    with pytest.raises(ArrowException) as actual:
        from_numpy(values)
    assert type(actual.value).__name__ == type(expected.value).__name__


def test_errors_are_the_types_streamlit_catches() -> None:
    # Streamlit falls back to converting a column to strings on these exceptions.
    from arrow_ipc_writer import ArrowInvalid, ArrowNotImplementedError, ArrowTypeError

    assert issubclass(ArrowInvalid, ValueError)
    assert issubclass(ArrowTypeError, TypeError)
    assert issubclass(ArrowNotImplementedError, NotImplementedError)


def test_duplicate_column_names() -> None:
    df = pd.DataFrame([[1, 2]], columns=["a", "a"])
    with pytest.raises(ValueError):
        dataframe_to_ipc(df)
