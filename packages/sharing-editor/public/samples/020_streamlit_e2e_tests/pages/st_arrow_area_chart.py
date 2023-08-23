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

import numpy as np
import pandas as pd

import streamlit as st
from tests.streamlit import snowpark_mocks

np.random.seed(0)

data = np.random.randn(20, 3)
df = pd.DataFrame(data, columns=["a", "b", "c"])

st._arrow_area_chart(df)
st._arrow_area_chart(df, x="a")
st._arrow_area_chart(df, y="a")
st._arrow_area_chart(df, y=["a", "b"])
st._arrow_area_chart(df, x="a", y="b")
st._arrow_area_chart(df, x="b", y="a")
st._arrow_area_chart(df, x="a", y=["b", "c"])

st._arrow_area_chart(snowpark_mocks.DataFrame())
