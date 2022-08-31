import streamlit as st
import pandas as pd
import numpy as np

st.set_page_config(page_title="Map Demo")

st.title("Map Demo")
st.write(
    """This demo is just copied from
    [the official `st.map` API reference page](https://docs.streamlit.io/library/api-reference/charts/st.map)
    """
)

df = pd.DataFrame(
     np.random.randn(1000, 2) / [50, 50] + [37.76, -122.4],
     columns=['lat', 'lon'])

st.map(df)
