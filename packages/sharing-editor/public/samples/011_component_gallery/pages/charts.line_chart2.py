import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(20, 3), columns=["col1", "col2", "col3"])
    return df


chart_data = load_data()

st.line_chart(
    chart_data, x="col1", y=["col2", "col3"], color=["#FF0000", "#0000FF"]  # Optional
)
