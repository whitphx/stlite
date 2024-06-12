import asyncio
import streamlit as st

with st.status("Downloading data..."):
    st.write("Searching for data...")
    await asyncio.sleep(2)
    st.write("Found URL.")
    await asyncio.sleep(1)
    st.write("Downloading data...")
    await asyncio.sleep(1)

st.button("Rerun")
