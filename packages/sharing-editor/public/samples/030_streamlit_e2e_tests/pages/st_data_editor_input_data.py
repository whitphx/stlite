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

import random

import numpy as np

import streamlit as st
from tests.streamlit.data_mocks import SHARED_TEST_CASES

np.random.seed(0)
random.seed(0)

st.set_page_config(layout="wide")

# # Render all test cases with st.dataframe:
for i, test_case in enumerate(SHARED_TEST_CASES):
    data = test_case[0]
    data_format = str(test_case[1].expected_data_format)
    st.subheader(data_format)
    st.experimental_data_editor(data, key=f"{i}-fixed")
    st.experimental_data_editor(data, num_rows="dynamic", key=f"{i}-dynamic")
