import streamlit as st
from numpy.random import default_rng as rng

df = rng(0).standard_normal((10, 1))
col1, col2 = st.columns([3, 1])

col1.subheader("A wide column with a chart")
col1.line_chart(df)

col2.subheader("A narrow column with the data")
col2.write(df)
