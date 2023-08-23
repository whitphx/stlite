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

import altair as alt
import numpy as np
import pandas as pd

import streamlit as st

df = pd.DataFrame({"a": [1, 2], "b": [3, 4], "c": [5, 6]})

table_element = st._arrow_table(df)
dataframe_element = st._arrow_dataframe(df)
chart_element_1 = st._arrow_line_chart()
chart_element_2 = st._arrow_line_chart(df)

# 4 identical charts, built in different ways.
vega_element_1 = st._arrow_vega_lite_chart(
    df,
    {
        "mark": {"type": "line", "point": True},
        "encoding": {
            "x": {"field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "quantitative"},
        },
    },
    use_container_width=True,
)
vega_element_2 = st._arrow_vega_lite_chart(
    {
        "datasets": {"foo": df},
        "data": {"name": "foo"},
        "mark": {"type": "line", "point": True},
        "encoding": {
            "x": {"field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "quantitative"},
        },
    },
    use_container_width=True,
)
vega_element_3 = st._arrow_vega_lite_chart(
    {
        "datasets": {"foo": df},
        "data": {"name": "foo"},
        "mark": {"type": "line", "point": True},
        "encoding": {
            "x": {"field": "a", "type": "quantitative"},
            "y": {"field": "b", "type": "quantitative"},
        },
    },
    use_container_width=True,
)
altair_element = st._arrow_altair_chart(
    alt.Chart(df).mark_line(point=True).encode(x="a", y="b").interactive(),
    use_container_width=True,
)

table_element._arrow_add_rows(df)
dataframe_element._arrow_add_rows(df)
chart_element_1._arrow_add_rows(df)
chart_element_2._arrow_add_rows(df)
vega_element_1._arrow_add_rows(df)
vega_element_2._arrow_add_rows(df)
vega_element_3._arrow_add_rows(foo=df)
altair_element._arrow_add_rows(df)

# Test that `_arrow_add_rows` errors out when the dataframe dimensions don't match.
# This should show an error!
dataframe_element = st._arrow_dataframe(df)
dataframe_element._arrow_add_rows(np.abs(np.random.randn(1, 6)))
