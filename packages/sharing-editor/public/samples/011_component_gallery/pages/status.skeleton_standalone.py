import streamlit as st
import time

placeholder = st.skeleton(height=200)
time.sleep(2)
placeholder.dataframe({"col1": [1, 2, 3], "col2": [4, 5, 6]})
