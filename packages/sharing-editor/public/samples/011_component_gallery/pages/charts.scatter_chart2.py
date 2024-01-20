import streamlit as st
import pandas as pd
import numpy as np


@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(20, 4), columns=["col1", "col2", "col3", "col4"])
    return df


chart_data = load_data()

st.scatter_chart(
    chart_data,
    x="col1",
    y=["col2", "col3"],
    size="col4",
    color=["#FF0000", "#0000FF"],  # Optional
)
