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

alt.themes.enable("streamlit")

np.random.seed(0)

data = np.random.randn(200, 3)
df = pd.DataFrame(data, columns=["a", "b", "c"])
chart = alt.Chart(df).mark_circle().encode(x="a", y="b", size="c", color="c")

st._arrow_altair_chart(chart, theme=None)
