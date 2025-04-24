import streamlit as st
import time

with st.spinner("Wait for it...", show_time=True):
    time.sleep(5)
st.success("Done!")
st.button("Rerun")
