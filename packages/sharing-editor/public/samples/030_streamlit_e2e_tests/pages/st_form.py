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

from datetime import date, time

import streamlit as st

# Tests all widgets, sans file_uploader, inside a form.
# st.file_uploader is omitted because it's so different; its form-related
# test lives inside the `st_file_uploader.py` spec instead.
with st.form("form"):
    checkbox = st.checkbox("Checkbox", False)
    color_picker = st.color_picker("Color Picker")
    date_input = st.date_input("Date Input", date(2019, 7, 6))
    multiselect = st.multiselect("Multiselect", ["foo", "bar"], default=["foo"])
    number_input = st.number_input("Number Input")
    radio = st.radio("Radio", ["foo", "bar", "baz"])
    selectbox = st.selectbox("Selectbox", ["foo", "bar", "baz"])
    select_slider = st.select_slider("Select Slider", ["foo", "bar", "baz"])
    slider = st.slider("Slider")
    text_area = st.text_area("Text Area", value="foo")
    text_input = st.text_input("Text Input", value="foo")
    time_input = st.time_input("Time Input", time(8, 45))
    st.form_submit_button("Submit")

"Checkbox:", checkbox
"Color Picker:", color_picker
"Date Input:", date_input
"Multiselect:", ", ".join(multiselect)
"Number Input:", number_input
"Radio:", radio
"Selectbox:", selectbox
"Select Slider:", select_slider
"Slider:", slider
"Text Area:", text_area
"Text Input:", text_input
"Time Input:", time_input
