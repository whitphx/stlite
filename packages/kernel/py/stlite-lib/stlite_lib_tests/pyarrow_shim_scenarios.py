"""Streamlit calls that send data through Arrow, run by pyarrow_shim_parity_test
once against the real pyarrow and once against the shim.

Each scenario takes the `streamlit` module. The elements it renders are
captured by the test; what it returns (Arrow bytes, or the name of the error a
call raised) is compared as well.
"""

from __future__ import annotations

import datetime
import decimal
from typing import Any

import numpy as np
import pandas as pd


def _frame_of_many_types() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "int": [1, -2, 3],
            "uint8": np.array([1, 2, 255], dtype=np.uint8),
            "float": [1.5, None, 3.0],
            "Int64": pd.array([1, None, 3], dtype="Int64"),
            "bool": [True, False, True],
            "boolean": pd.array([True, None, False], dtype="boolean"),
            "str": ["a", None, "日本語🎈"],
            "bytes": [b"a", None, b"\xff"],
            "datetime": pd.to_datetime(
                ["2024-01-01 00:00:00", None, "2024-01-03 04:05:06"]
            ),
            "datetime_tz": pd.date_range("2024-01-01", periods=3, tz="Asia/Tokyo"),
            "date": [datetime.date(2024, 1, 1), None, datetime.date(1969, 12, 31)],
            "time": [datetime.time(1, 2), None, datetime.time(23, 59, 59)],
            "timedelta": pd.to_timedelta([1, None, 3], unit="h"),
            "decimal": [decimal.Decimal("1.50"), None, decimal.Decimal("-2.25")],
            "category": pd.Categorical(["x", "y", "x"]),
            "category_ints": pd.Categorical([1, 2, 1]),
            "interval": pd.interval_range(0, 3),
            "period": pd.period_range("2024-01", periods=3, freq="M"),
            "list": [[1, 2], [], None],
            "list_of_str": [["a"], ["b", None], []],
            "dict": [{"k": 1}, {"k": 2}, None],
            "all_none": [None, None, None],
        }
    )


_NUMERIC = pd.DataFrame(
    {"a": [1, 3, 2, 4], "b": [2.5, 1.0, None, 3.5], "c": [10, 20, 30, 40]}
)
_LONG = pd.DataFrame(
    {
        "x": [1, 2, 3, 1, 2, 3],
        "y": [4.0, 5.5, 6.0, 1.0, 2.5, 3.0],
        "group": ["p", "p", "p", "q", "q", "q"],
        "size": [10, 20, 30, 40, 50, 60],
    }
)


def dataframe_of_many_types(st: Any) -> None:
    st.dataframe(_frame_of_many_types())


def dataframe_index_kinds(st: Any) -> None:
    values = {"v": [1, 2, 3]}
    for index in [
        pd.RangeIndex(10, 16, 2, name="r"),
        pd.Index(["a", "b", "c"], name="letters"),
        pd.DatetimeIndex(["2024-01-01", "2024-01-02", "2024-01-03"], name="when"),
        pd.MultiIndex.from_tuples([("a", 1), ("a", 2), ("b", 1)], names=["k", None]),
        pd.CategoricalIndex(["x", "y", "x"]),
    ]:
        st.dataframe(pd.DataFrame(values, index=index))


def dataframe_multiindex_columns(st: Any) -> None:
    columns = pd.MultiIndex.from_tuples([("a", "x"), ("a", "y")], names=["t", "b"])
    st.dataframe(pd.DataFrame([[1, 2], [3, 4]], columns=columns))


def dataframe_column_config(st: Any) -> None:
    st.dataframe(
        _frame_of_many_types(),
        column_config={
            "int": st.column_config.NumberColumn("Int", format="%d"),
            "list": st.column_config.ListColumn(),
            "datetime": st.column_config.DatetimeColumn(format="YYYY"),
        },
        hide_index=True,
    )


def dataframe_styler(st: Any) -> None:
    # A fixed uuid, as pandas otherwise draws one at random for each Styler.
    styler = _NUMERIC.style.set_uuid("parity")
    st.dataframe(styler.highlight_max(axis=0).format(precision=2))


def dataframe_needing_fixes(st: Any) -> None:
    # Columns pyarrow rejects; Streamlit converts them to strings and retries.
    st.dataframe(
        pd.DataFrame(
            {
                "mixed": pd.Series([1, "a", 2.5], dtype=object),
                "mixed_lists": pd.Series([[1, 2], [[1]], None], dtype=object),
                "ok": [1, 2, 3],
            }
        )
    )


def dataframe_failing_to_convert(st: Any) -> str:
    # Converting this column to strings doesn't help either, so Streamlit
    # raises, with pyarrow's message.
    try:
        st.dataframe(pd.DataFrame({"huge_int": pd.Series([2**70, 1], dtype=object)}))
    except Exception as e:
        return f"{type(e).__name__}: {e}"
    return "no error"


def dataframe_other_inputs(st: Any) -> None:
    st.dataframe([1, 2, 3])
    st.dataframe({"a": [1, 2], "b": ["x", "y"]})
    st.dataframe(np.arange(6).reshape(2, 3))
    st.dataframe(pd.Series([1.5, 2.5], name="s"))
    st.dataframe(pd.DataFrame())
    st.dataframe(pd.DataFrame({"empty": pd.Series([], dtype="int64")}))


def table_and_write(st: Any) -> None:
    st.table(_frame_of_many_types())
    st.write(_NUMERIC)


def data_editor(st: Any) -> None:
    editable = pd.DataFrame(
        {
            "int": [1, 2],
            "float": [1.5, None],
            "str": ["a", "b"],
            "bool": [True, False],
            "datetime": pd.to_datetime(["2024-01-01", "2024-01-02"]),
            "date": [datetime.date(2024, 1, 1), datetime.date(2024, 1, 2)],
            "time": [datetime.time(1), datetime.time(2)],
            "list": [["a"], ["b", "c"]],
            "category": pd.Categorical(["x", "y"]),
        }
    )
    st.data_editor(editable, key="editor", num_rows="fixed")
    st.data_editor(editable, num_rows="dynamic", hide_index=True)


def data_editor_needing_fixes(st: Any) -> None:
    st.data_editor(
        pd.DataFrame({"mixed": pd.Series([1, "a"], dtype=object), "n": [1, 2]}),
        key="mixed_editor",
    )


def built_in_charts(st: Any) -> None:
    st.line_chart(_NUMERIC)
    st.bar_chart(_LONG, x="x", y="y", color="group")
    st.area_chart(_NUMERIC, x="a", y=["b", "c"])
    st.scatter_chart(_LONG, x="x", y="y", size="size", color="group")
    st.bar_chart(_NUMERIC, horizontal=True, stack=False)


def altair_and_vega_lite_charts(st: Any) -> None:
    import altair as alt

    st.altair_chart(
        alt.Chart(_LONG).mark_line().encode(x="x", y="y", color="group"),
    )
    st.vega_lite_chart(
        _NUMERIC,
        {"mark": "bar", "encoding": {"x": {"field": "a"}, "y": {"field": "b"}}},
    )


def lazy_chunks(st: Any) -> list[bytes | str]:
    # Large dataframes are served in chunks, sorted on request. That needs a
    # running server, so this drives the source the server would.
    from streamlit import dataframe_util
    from streamlit.dataframe import lazy_df_source

    df = _frame_of_many_types().sample(n=300, replace=True, random_state=0)
    df["rank"] = np.arange(len(df))[::-1]
    source = lazy_df_source._in_memory_source_from_pandas(df)
    results: list[bytes | str] = []
    sorts = [None] + [
        lazy_df_source.SortSpec(column=str(name), descending=descending)
        for name in [*df.columns, "__index_level_0__"]
        for descending in (False, True)
    ]
    for sort in sorts:
        for offset, limit in [(0, 50), (250, 100)]:
            try:
                table = source.load_rows(offset, limit, sort=sort)
                results.append(dataframe_util.convert_arrow_table_to_arrow_bytes(table))
            except Exception as e:
                results.append(type(e).__name__)
    return results


SCENARIOS = {
    name: scenario
    for name, scenario in globals().items()
    if callable(scenario)
    and not name.startswith("_")
    and getattr(scenario, "__module__", None) == __name__
}
