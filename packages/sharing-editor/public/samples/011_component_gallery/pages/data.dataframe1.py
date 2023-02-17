import streamlit as st
import pandas as pd
import numpy as np

@st.cache_data
def load_data():
    df = pd.DataFrame(np.random.randn(10, 20), columns=("col %d" % i for i in range(20)))
    return df

df = load_data()

st.dataframe(df.style.highlight_max(axis=0))
