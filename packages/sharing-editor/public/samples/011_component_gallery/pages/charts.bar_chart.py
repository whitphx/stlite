import streamlit as st
import pandas as pd
import numpy as np

@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(50, 3), columns=["a", "b", "c"])
    return df

chart_data = load_data()

st.bar_chart(chart_data)
