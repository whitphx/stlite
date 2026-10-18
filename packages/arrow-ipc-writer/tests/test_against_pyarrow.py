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
    # Catches malformed buffers (offsets, null counts, UTF-8) that reading
    # alone lets through.
    actual.validate(full=True)

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
    # Mixes 1-, 2-, 3- and 4-byte UTF-8, so byte lengths differ from
    # character counts.
    "str_non_ascii": ["café", None, "日本語🎈"],
    "str_non_ascii_python": pd.array(
        ["ü", None, "🎈x"], dtype=pd.StringDtype("python")
    ),
    "unicode_numpy_non_ascii": np.array(["é", "日本", ""]),
    "str_empty_and_null": ["", None, ""],
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
    "decimal_fractions": [decimal.Decimal("0.05"), decimal.Decimal("0.10"), None],
    "decimal_widening": [decimal.Decimal("0.5"), decimal.Decimal("10"), None],
    "decimal_nan": [decimal.Decimal("1.5"), decimal.Decimal("NaN"), None],
    "decimal256": [decimal.Decimal("1" + "0" * 40), decimal.Decimal("-1.5"), None],
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
    "list_of_numpy_datetimes": [
        np.array(["2024-01-01T00:00:00.000000001", "NaT"], dtype="datetime64[ns]"),
        None,
        np.array([], dtype="datetime64[ns]"),
    ],
    "list_of_numpy_durations": [np.array([1, 2], dtype="timedelta64[ns]"), None, None],
    "list_of_numpy_and_lists": [np.array([1], dtype=np.int32), [2], None],
    "list_of_numpy_strings": [np.array(["a", "b"]), None, np.array(["c"])],
    "list_of_str": [["a", None], [], None],
    "tuple": [(1, 2), (3,), None],
    "set": [{1, 2}, {3}, None],
    "nested_list": [[[1], [2, 3]], None, [[]]],
    "dict": [{"a": 1}, {"a": 2, "b": "x"}, None],
    "nested_dict": [{"a": {"b": [1, 2]}}, {"a": None}, None],
    "all_none": [None, None, None],
    "int_and_float_objects": pd.Series([1, 2.5, None], dtype=object),
    "numpy_scalars_object": pd.Series([np.int32(1), np.int64(2), None], dtype=object),
    "numpy_int32_scalars": pd.Series([np.int32(1), None, np.int32(3)], dtype=object),
    "numpy_uint64_scalars": pd.Series([np.uint64(2**64 - 1), None, None], dtype=object),
    "numpy_datetime_scalars": pd.Series(
        [np.datetime64("2024-01-01T00:00:00.000000001"), None, None], dtype=object
    ),
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


@pytest.mark.parametrize(
    "column",
    [pd.cut([1, 5, 9], 3), pd.cut([1.0, np.nan, 9.0], [0, 5, 10])],
    ids=["cut", "cut_with_nan"],
)
def test_dictionary_of_extension_type(column: pd.Categorical) -> None:
    # pd.cut gives categories of pandas' interval extension type. pyarrow
    # writes such a column, but can't read it back ("Ran out of field
    # metadata"), so this compares our stream with pyarrow's own, both read
    # with the extension type unregistered, which reads its storage instead.
    from pandas.core.arrays.arrow.extension_types import ArrowIntervalType

    df = pd.DataFrame({"c": column})
    table = pa.Table.from_pandas(df)
    sink = pa.BufferOutputStream()
    with pa.ipc.new_stream(sink, table.schema) as writer:
        writer.write_table(table)

    pa.unregister_extension_type("pandas.interval")
    try:
        expected = pa.ipc.open_stream(sink.getvalue()).read_all()
        actual = pa.ipc.open_stream(dataframe_to_ipc(df)).read_all()
    finally:
        pa.register_extension_type(ArrowIntervalType(pa.int64(), "right"))

    actual.validate(full=True)
    assert actual.schema.equals(expected.schema, check_metadata=False)
    assert actual.schema.field("c").metadata == expected.schema.field("c").metadata
    assert actual.equals(expected)
    assert _pandas_metadata(actual) == _pandas_metadata(expected)


_D = decimal.Decimal
_DATE = datetime.date(2024, 1, 1)
_DATETIME = datetime.datetime(2024, 1, 2, 3, 4)
_UTC_DATETIME = datetime.datetime(2024, 1, 1, tzinfo=datetime.timezone.utc)

# pyarrow infers the type of object values in order and stops at the first
# value of most kinds, so whether these convert, and to what type or with
# which error, depends on the order of their values.
MIXED_OBJECTS = {
    "str_int": ["a", 1],
    "int_str": [1, "a"],
    "str_bytes": ["a", b"b"],
    "bytes_str": [b"b", "a"],
    "str_float": ["a", 1.5],
    "str_bool": ["a", True],
    "bytes_int": [b"x", 1],
    "int_float_str": [1, 2.5, "x"],
    "int_str_float": [1, "x", 2.5],
    "float_int": [1.5, 2],
    "bool_int": [True, 1],
    "int_bool": [1, True],
    "bool_float": [True, 1.5],
    "float_bool": [1.5, True],
    "bool_str": [True, "a"],
    "list_str": [[1], "a"],
    "str_list": ["a", [1]],
    "dict_int": [{"a": 1}, 1],
    "int_dict": [1, {"a": 1}],
    "decimal_int": [_D("1"), 2],
    "int_decimal": [2, _D("1.5")],
    "decimal_too_narrow_int": [_D("1"), 100],
    "decimal_float": [_D("1"), 1.5],
    "float_decimal": [1.5, _D("1")],
    "decimal_str": [_D(1), "a"],
    "str_decimal": ["a", _D(1)],
    "decimal_bool": [_D(1), True],
    "decimal_date": [_D(1), _DATE],
    "decimal_infinity": [_D("Infinity")],
    "date_datetime": [_DATE, _DATETIME],
    "datetime_date": [_DATETIME, _DATE],
    "date_int": [_DATE, 1],
    "date_str": [_DATE, "a"],
    "naive_aware": [_DATETIME, _UTC_DATETIME],
    "aware_naive": [_UTC_DATETIME, _DATETIME],
    "datetime_int": [_DATETIME, 1],
    "datetime_float": [_DATETIME, 1.5],
    "int_datetime": [1, _DATETIME],
    "timedelta_int": [datetime.timedelta(1), 1],
    "timedelta_datetime": [datetime.timedelta(1), _DATETIME],
    "time_date": [datetime.time(1), _DATE],
    "time_int": [datetime.time(1), 1],
    "big_int_float": [2**60 + 1, 1.5],
    "float_big_int": [1.5, 2**60 + 1],
    "exact_int_float": [2**53, 1.5],
    "int_overflow": [2**64, 1],
    "unknown_object": [object()],
    "str_unknown_object": ["a", object()],
    "frozenset": [frozenset({1})],
    "numpy_bool_int": [np.bool_(True), 1],
    "numpy_int_bool": [np.int32(1), True],
    "numpy_int_float": [np.int32(1), 2.5],
    "numpy_int_str": [np.int32(1), "a"],
    "str_numpy_int": ["a", np.int32(1)],
    "float_numpy_bool": [1.5, np.bool_(True)],
    "numpy_uint8_int8": [np.uint8(1), np.int8(2)],
    "numpy_int32_float32": [np.int32(1), np.float32(2)],
    "numpy_datetime_units": [np.datetime64("2024-01-01", "s"), np.datetime64(1, "ns")],
    "numpy_datetime_python": [np.datetime64("2024-01-01", "s"), _DATETIME],
    "uint64_max_int": [np.uint64(2**64 - 1), 1],
    "lists_int_str": [[1], ["a"]],
    "lists_str_int": [["a"], [1]],
    "tuples_mixed": [(1, "a"), (2, "b"), None],
    "dicts_int_str": [{"a": 1}, {"a": "x"}],
    "dict_int_key": [{1: 2}],
    "dict_bytes_key": [{b"a": 2}],
    "empty_dict": [{}],
    "empty_list": [[]],
    "set": [{1, 2}],
    "ndarray_2d": [np.array([[1, 2]])],
    "ndarray_objects": [np.array([1, "a"], dtype=object)],
    "lists_numpy_int8_int16": [np.array([1], dtype=np.int8), np.array([1], np.int16)],
    "lists_numpy_int_float": [np.array([1], dtype=np.int32), np.array([1.5])],
}


@pytest.mark.parametrize("name", list(MIXED_OBJECTS))
def test_mixed_object_column(name: str) -> None:
    df = pd.DataFrame({"c": pd.Series(MIXED_OBJECTS[name], dtype=object)})
    try:
        pa.Table.from_pandas(df)
    except Exception as e:
        # Streamlit decides how to recover from the exception's type.
        with pytest.raises(Exception) as actual:
            dataframe_to_ipc(df)
        assert type(actual.value).__name__ == type(e).__name__, actual.value
    else:
        assert_matches_pyarrow(df)


def test_random_unicode_strings() -> None:
    # Byte offsets of non-ASCII strings are worked out from the encoded
    # data in bulk; random text with 1- to 4-byte characters, empty strings
    # and nulls checks them against pyarrow's.
    rng = np.random.default_rng(0)
    codepoints = np.concatenate(
        [
            rng.integers(0x20, 0x7F, 1000),  # 1 byte
            rng.integers(0xA0, 0x800, 1000),  # 2 bytes
            rng.integers(0x800, 0xD800, 1000),  # 3 bytes
            rng.integers(0x10000, 0x110000, 1000),  # 4 bytes
        ]
    )
    values: list[str | None] = [
        "".join(map(chr, rng.choice(codepoints, rng.integers(0, 8))))
        for _ in range(5000)
    ]
    for i in rng.choice(len(values), 500, replace=False):
        values[i] = None
    assert_matches_pyarrow(pd.DataFrame({"s": pd.Series(values, dtype=object)}))


ERROR_COLUMNS = {
    "complex": np.array([1 + 2j, 3j]),
    "interval_tz": pd.interval_range(
        pd.Timestamp("2024-01-01", tz="UTC"), periods=2, freq="D"
    ),
}


@pytest.mark.parametrize("name", list(ERROR_COLUMNS))
def test_unconvertible_column(name: str) -> None:
    df = pd.DataFrame({name: ERROR_COLUMNS[name]})
    with pytest.raises(Exception) as expected:
        pa.Table.from_pandas(df)
    with pytest.raises(Exception) as actual:
        dataframe_to_ipc(df)
    assert type(actual.value).__name__ == type(expected.value).__name__


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
    from arrow_ipc_writer import (
        ArrowCapacityError,
        ArrowInvalid,
        ArrowNotImplementedError,
        ArrowTypeError,
    )

    assert issubclass(ArrowInvalid, ValueError)
    assert issubclass(ArrowTypeError, TypeError)
    assert issubclass(ArrowNotImplementedError, NotImplementedError)
    # pyarrow's capacity error is none of those, so Streamlit lets it propagate
    # instead of retrying with the columns converted to strings.
    assert not issubclass(ArrowCapacityError, ValueError)
    assert not issubclass(pa.ArrowCapacityError, ValueError)


def test_duplicate_column_names() -> None:
    df = pd.DataFrame([[1, 2]], columns=["a", "a"])
    with pytest.raises(ValueError):
        dataframe_to_ipc(df)
