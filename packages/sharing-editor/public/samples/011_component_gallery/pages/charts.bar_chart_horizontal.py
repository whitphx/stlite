import streamlit as st
from vega_datasets import data

@st.cache_data
def get_data():
    return data.barley()

source = get_data()

st.bar_chart(source, x="variety", y="yield", color="site", horizontal=True)
