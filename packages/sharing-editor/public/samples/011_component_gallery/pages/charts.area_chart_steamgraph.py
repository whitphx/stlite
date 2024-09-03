import streamlit as st
from vega_datasets import data

source = data.unemployment_across_industries()

st.area_chart(source, x="date", y="count", color="series", stack="center")
