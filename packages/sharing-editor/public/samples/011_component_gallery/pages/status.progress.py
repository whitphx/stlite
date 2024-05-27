import streamlit as st
import asyncio

progress_text = "Operation in progress. Please wait."
my_bar = st.progress(0, text=progress_text)

for percent_complete in range(100):
    await asyncio.sleep(0.01)
    my_bar.progress(percent_complete + 1, text=progress_text)
await asyncio.sleep(1)
my_bar.empty()

st.button("Rerun")
