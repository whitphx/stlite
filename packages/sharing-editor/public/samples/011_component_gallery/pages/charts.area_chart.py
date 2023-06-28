import numpy as np
import pandas as pd
import streamlit as st


@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(20, 3), columns=["a", "b", "c"])
    return df


chart_data = load_data()

st.area_chart(chart_data)
