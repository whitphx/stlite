import streamlit as st
from vega_datasets import data

df = data.unemployment_across_industries()

st.area_chart(df, x="date", y="count", color="series", stack="center")
