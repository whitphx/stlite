# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""st._legacy_altair_chart unit test."""
import json
from datetime import date
from functools import reduce

import altair as alt
import pandas as pd
import pyarrow as pa

import streamlit as st
from streamlit.elements import legacy_altair as altair
from streamlit.errors import StreamlitAPIException
from tests.delta_generator_test_case import DeltaGeneratorTestCase


def _deep_get(dictionary, *keys):
    return reduce(
        lambda d, key: d.get(key, None) if isinstance(d, dict) else None,
        keys,
        dictionary,
    )


class LegacyAltairTest(DeltaGeneratorTestCase):
    """Test ability to marshall altair_chart proto."""

    def test_legacy_altair_chart(self):
        """Test that it can be called with no args."""
        df1 = pd.DataFrame([["A", "B", "C", "D"], [28, 55, 43, 91]], index=["a", "b"]).T

        c1 = alt.Chart(df1).mark_bar().encode(x="a", y="b")

        st._legacy_altair_chart(c1)

        c = self.get_delta_from_queue().new_element.vega_lite_chart
        self.assertEqual(c.HasField("data"), False)
        self.assertEqual(len(c.datasets), 1)

        spec_dict = json.loads(c.spec)
        self.assertEqual(
            spec_dict["encoding"],
            {
                "y": {"field": "b", "type": "quantitative"},
                "x": {"field": "a", "type": "nominal"},
            },
        )
        self.assertEqual(spec_dict["data"], {"name": c.datasets[0].name})
        self.assertEqual(spec_dict["mark"], "bar")
        self.assertTrue("encoding" in spec_dict)

    def test_date_column_utc_scale(self):
        """Test that columns with date values have UTC time scale"""
        df = pd.DataFrame(
            {"index": [date(2019, 8, 9), date(2019, 8, 10)], "numbers": [1, 10]}
        ).set_index("index")

        chart = altair.generate_chart("line", df)
        st._legacy_altair_chart(chart)
        c = self.get_delta_from_queue().new_element.vega_lite_chart
        spec_dict = json.loads(c.spec)

        # The x axis should have scale="utc", because it uses date values.
        x_scale = _deep_get(spec_dict, "encoding", "x", "scale", "type")
        self.assertEqual(x_scale, "utc")

        # The y axis should _not_ have scale="utc", because it doesn't
        # use date values.
        y_scale = _deep_get(spec_dict, "encoding", "y", "scale", "type")
        self.assertNotEqual(y_scale, "utc")


class LegacyChartsTest(DeltaGeneratorTestCase):
    """Test legacy charts."""

    def test_legacy_line_chart(self):
        """Test dg._legacy_line_chart."""
        data = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        st._legacy_line_chart(data, width=640, height=480)

        element = self.get_delta_from_queue().new_element.vega_lite_chart
        chart_spec = json.loads(element.spec)
        self.assertEqual(chart_spec["mark"], "line")
        self.assertEqual(chart_spec["width"], 640)
        self.assertEqual(chart_spec["height"], 480)

        self.assertEqual(
            element.datasets[0].data.data.cols[2].int64s.data, [20, 30, 50]
        )

    def test_legacy_line_chart_with_generic_index(self):
        """Test dg._legacy_line_chart with a generic index."""
        data = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])
        data.set_index("a", inplace=True)

        st._legacy_line_chart(data)

        element = self.get_delta_from_queue().new_element.vega_lite_chart
        chart_spec = json.loads(element.spec)
        self.assertEqual(chart_spec["mark"], "line")
        self.assertEqual(element.datasets[0].data.data.cols[2].int64s.data[0], 30)

    def test_legacy_line_chart_add_rows_with_generic_index(self):
        """Test empty dg._legacy_line_chart with _legacy_add_rows function and a generic index."""
        data = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])
        data.set_index("a", inplace=True)

        chart = st._legacy_line_chart()
        chart._legacy_add_rows(data)

        element = self.get_delta_from_queue().new_element.vega_lite_chart
        chart_spec = json.loads(element.spec)
        self.assertEqual(chart_spec["mark"], "line")
        self.assertEqual(element.datasets[0].data.data.cols[2].int64s.data[0], 30)

    def test_legacy_area_chart(self):
        """Test dg._legacy_area_chart."""
        data = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        st._legacy_area_chart(data, width=640, height=480)

        element = self.get_delta_from_queue().new_element.vega_lite_chart
        chart_spec = json.loads(element.spec)
        self.assertEqual(chart_spec["mark"], "area")
        self.assertEqual(chart_spec["width"], 640)
        self.assertEqual(chart_spec["height"], 480)
        self.assertEqual(
            element.datasets[0].data.columns.plain_index.data.strings.data,
            ["index", "variable", "value"],
        )
        self.assertEqual(
            element.datasets[0].data.data.cols[2].int64s.data, [20, 30, 50]
        )

    def test_legacy_bar_chart(self):
        """Test dg._legacy_bar_chart."""
        data = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        st._legacy_bar_chart(data, width=640, height=480)

        element = self.get_delta_from_queue().new_element.vega_lite_chart
        chart_spec = json.loads(element.spec)

        self.assertEqual(chart_spec["mark"], "bar")
        self.assertEqual(chart_spec["width"], 640)
        self.assertEqual(chart_spec["height"], 480)
        self.assertEqual(
            element.datasets[0].data.columns.plain_index.data.strings.data,
            ["index", "variable", "value"],
        )
        self.assertEqual(
            element.datasets[0].data.data.cols[2].int64s.data, [20, 30, 50]
        )

    def test_legacy_line_chart_with_pyarrow_table_data(self):
        """Test that an error is raised when called with `pyarrow.Table` data."""
        df = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        with self.assertRaises(StreamlitAPIException):
            st._legacy_line_chart(pa.Table.from_pandas(df))

    def test_legacy_area_chart_with_pyarrow_table_data(self):
        """Test that an error is raised when called with `pyarrow.Table` data."""
        df = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        with self.assertRaises(StreamlitAPIException):
            st._legacy_area_chart(pa.Table.from_pandas(df))

    def test_legacy_bar_chart_with_pyarrow_table_data(self):
        """Test that an error is raised when called with `pyarrow.Table` data."""
        df = pd.DataFrame([[20, 30, 50]], columns=["a", "b", "c"])

        with self.assertRaises(StreamlitAPIException):
            st._legacy_bar_chart(pa.Table.from_pandas(df))
