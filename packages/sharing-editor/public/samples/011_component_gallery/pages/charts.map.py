import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(
        np.random.randn(1000, 2) / [50, 50] + [37.76, -122.4], columns=["lat", "lon"]
    )
    return df


df = load_data()

st.map(df)
