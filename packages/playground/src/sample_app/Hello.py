# Copyright 2018-2022 Streamlit Inc.
# Copyright 2022 Yuichiro Tachibana (Tsuchiya).
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import streamlit as st

st.set_page_config(page_title="Hello")

st.write("# Welcome to stlite! 👋")

st.sidebar.success("Select a demo above.")

st.image("https://raw.githubusercontent.com/whitphx/stlite/main/docs/images/logo.svg")

st.markdown("""
_A port of [Streamlit](https://streamlit.io/) to WebAssembly, powered by [Pyodide](https://pyodide.org/)_.

Streamlit is a Python web app framework for the fast development of data apps.
**stlite** project is to make it run **completely on web browsers**.

**👈 Select a demo from the sidebar** to see some examples
of what stlite can do!

**👇 Edit the source code** in the editor to run any code you like!

To install additional packages, edit and save the `requirements` tab in the editor.

Tips: Only pure Python packages and C-extensions built for Pyodide can be installed.
For more information, read [this document](https://pyodide.org/en/stable/usage/loading-packages.html).
stlite uses [`micropip.install()`](https://pyodide.org/en/stable/usage/api/micropip-api.html#micropip.install) in its internals for installing packages.

### Want to learn more about stlite?
- Visit [the GitHub repository and its README](https://github.com/whitphx/stlite)
### Want to learn more about Streamlit?
- Check out [streamlit.io](https://streamlit.io)
- Jump into our [documentation](https://docs.streamlit.io)
- Ask a question in our [community
    forums](https://discuss.streamlit.io)
### See more complex demos
- OpenCV image processing running completely on web browsers: [Serverless Image Processing App](https://github.com/whitphx/stlite-image-processing-app)
""")
