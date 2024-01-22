import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    return pd.DataFrame(
        {
            "col1": np.random.randn(1000) / 50 + 37.76,
            "col2": np.random.randn(1000) / 50 + -122.4,
            "col3": np.random.randn(1000) * 100,
            "col4": np.random.rand(1000, 4).tolist(),
        }
    )


df = load_data()

st.map(df, latitude="col1", longitude="col2", size="col3", color="col4")
