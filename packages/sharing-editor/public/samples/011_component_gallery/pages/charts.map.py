import streamlit as st
import pandas as pd
import numpy as np

@st.experimental_memo
def load_data():
    df = pd.DataFrame(
        np.random.randn(1000, 2) / [50, 50] + [37.76, -122.4], columns=["lat", "lon"]
    )
    return df

df = load_data()

st.map(df)
