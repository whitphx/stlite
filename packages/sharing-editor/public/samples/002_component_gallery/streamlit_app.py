import streamlit as st

st.title("Streamlit Component Gallery")

st.image("https://docs.streamlit.io/logo.svg")

st.markdown("""
This _stlite_ sample app contains the demos embedded on the Streamlit official document (https://docs.streamlit.io/).

**👈 Select a demo from the sidebar** to see some examples
of Streamlit built-in components!
""")

st.markdown("""
### Notes

The page files (`pages/*`) are copied from [the Streamlit official document sample directory (`docs/python/api-examples-source`)](https://github.com/streamlit/docs/tree/5e62035f0ea36b211232ae3a5778dcd8ffdcac15/python/api-examples-source)
excluding the sub directories.

The following files have been changed:
* `widget.download_button.py`:
  A local file path in the source code has been rewritten to adjust to the directory structure of this sample app.

Due to the browser environment limitations,
some components do not work well.
The known issues are listed at https://github.com/whitphx/stlite#limitations.

### License
As written above, the files `pages/*` are copied from `https://github.com/streamlit/docs` with some modifications,
therefore, the license applied to the source, the Apache-2.0 license, is also applied to this sample as follows.

#### Apache-2.0 license

Copyright Streamlit Inc.

Copyright Yuichiro Tachibana

Licensed under the Apache License, Version 2.0 (the “License”);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an “AS IS” BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

See https://github.com/streamlit/docs/blob/main/LICENSE
""")
