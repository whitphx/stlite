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

import pandas as pd

import streamlit as st
from streamlit import runtime
from tests.streamlit import pyspark_mocks

options = ("female", "male")
i1 = st.radio("radio 1", options, 1)
st.write("value 1:", i1)

i2 = st.radio("radio 2", options, 0, format_func=lambda x: x.capitalize())
st.write("value 2:", i2)

i3 = st.radio("radio 3", [])
st.write("value 3:", i3)

i4 = st.radio("radio 4", options, disabled=True)
st.write("value 4:", i4)

i5 = st.radio("radio 5", options, horizontal=True)
st.write("value 5:", i5)

i6 = st.radio("radio 6", pd.DataFrame({"foo": list(options)}))
st.write("value 6:", i6)

i7 = st.radio("radio 7", options, label_visibility="hidden")
st.write("value 7:", i7)

i8 = st.radio("radio 8", options, label_visibility="collapsed")
st.write("value 8:", i8)


if runtime.exists():

    def on_change():
        st.session_state.radio_changed = True

    st.radio("radio 9", options, 1, key="radio9", on_change=on_change)
    st.write("value 9:", st.session_state.radio9)
    st.write("radio changed:", "radio_changed" in st.session_state)

st.radio("PySpark radio", pyspark_mocks.DataFrame())  # type: ignore
