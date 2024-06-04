import streamlit as st
import asyncio

if st.button("Three cheers"):
    st.toast("Hip!")
    await asyncio.sleep(0.5)
    st.toast("Hip!")
    await asyncio.sleep(0.5)
    st.toast("Hooray!", icon="🎉")
