import asyncio
import streamlit as st

with st.status("Downloading data...", expanded=True) as status:
    st.write("Searching for data...")
    await asyncio.sleep(2)
    st.write("Found URL.")
    await asyncio.sleep(1)
    st.write("Downloading data...")
    await asyncio.sleep(1)
    status.update(label="Download complete!", state="complete", expanded=False)

st.button("Rerun")
