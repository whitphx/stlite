import streamlit as st

st.title("Stlite Sharing: Serverless Streamlit app platform")

col1, col2 = st.columns(2, vertical_alignment="center", gap="large")
with col1:
    st.image("data/logo.png", use_container_width=True)
with col2:
    st.image("https://streamlit.io/images/brand/streamlit-mark-color.svg", use_container_width=True)

st.markdown("""
### Stlite
**Stlite** is a port of _Streamlit:streamlit:_ to Wasm, powered by Pyodide,
that runs completely on web browsers.

The official repository is [🔗 here](https://github.com/whitphx/stlite).

If you are new to Streamlit, read the Getting Started tutorial [🔗 here](https://docs.streamlit.io/library/get-started) first
(don't worry, it only takes a few minutes 👍),
but **you can skip the "Installation" section** because you are here 😎.
You can start writing code right out of the box on this online editor 👈!
(If there is not an editor on the left, you are seeing the shared app.
Navigate to the editor mode: https://edit.share.stlite.net/)

### Stlite Sharing
This page is built on **Stlite Sharing**, an online code editor & sharing platform for _Stlite_. \\
If you see the editor and preview panes side by side, you are in the editor mode, https://edit.share.stlite.net/. \\
If you see only this Streamlit app, you are in the sharing mode, https://share.stlite.net/.
(If you want to edit the app, please go to the [editor mode](https://edit.share.stlite.net/)!)

The app code and data are encoded into the URL as a hash like `https://share.stlite.net/#!ChBz...`,
so you can save, share and restore the app only this the URL.
If you are on the editor page, click the "Open App" link on the top right toolbar to see the standalone app!

You can switch the editor and sharing modes by replacing the host name in the URL,
`edit.share.stlite.net` and `share.stlite.net`.

### Tell your story!
When you create some apps with _Stlite_, please share it!
All you need to do is copy and paste the URL 👍

* **Stlite** GitHub Discussions [🔗 here](https://github.com/whitphx/stlite/discussions/categories/show-and-tell)
* Streamlit community forum [🔗 here](https://discuss.streamlit.io/)
""")

st.header("Streamlit Component Samples")
st.markdown("""
    All these features are working on your browser!
""")

name = st.text_input("Your name?")
st.write("Hello,", name or "world", "!")

value = st.slider("Value?")
st.write("The slider value is", value)

import numpy as np
import pandas as pd


@st.cache_data
def get_chart_data():
    return pd.DataFrame(
        np.random.randn(20, 3),
        columns=['a', 'b', 'c']
    )


st.subheader("Chart sample")
chart_data = get_chart_data()

tab1, tab2, tab3 = st.tabs(["Line chart", "Area chart", "Bar chart"])
with tab1:
    st.line_chart(chart_data)
with tab2:
    st.area_chart(chart_data)
with tab3:
    st.bar_chart(chart_data)

st.subheader("DataFrame sample")


@st.cache_data
def get_sample_df():
    return pd.DataFrame(
        np.random.randn(50, 20),
        columns=('col %d' % i for i in range(20))
    )


df = get_sample_df()
st.dataframe(df)

st.subheader("Camera input")
st.info("Don't worry! The photo data is processed on your browser and never uploaded to any remote servers.")
enable_camera_input = st.checkbox("Use the camera input")
if enable_camera_input:
    picture = st.camera_input("Take a picture")

    if picture:
        st.image(picture)
