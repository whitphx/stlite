import streamlit as st
import numpy as np

@st.cache_data
def load_data():
    data = np.random.randn(10, 1)
    return data

col1, col2 = st.columns([3, 1])
data = load_data()

col1.subheader("A wide column with a chart")
col1.line_chart(data)

col2.subheader("A narrow column with the data")
col2.write(data)
