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

import streamlit as st

c1, c2, c3 = st.columns(3)

c1.write("Foo")
c2.write("Bar")
c3.write("Baz")

c1, c2, c3 = st.columns(3)

# We use longer text here because movement should
# be considered a large change in the screenshot comparison
c3.write("Some long text to write")
