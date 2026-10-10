import streamlit as st

page = st.pagination(num_pages=10)
st.write(f"Showing page {page}")
