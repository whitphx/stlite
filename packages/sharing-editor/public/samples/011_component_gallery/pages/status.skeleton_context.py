import streamlit as st
import time

with st.skeleton(height=100):
    # Expensive computation runs here
    time.sleep(2)

# Skeleton clears, show results below
st.success("Data loaded!")
