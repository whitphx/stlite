import streamlit as st
import asyncio


@st.experimental_fragment
def release_the_balloons():
    st.button("Release the balloons", help="Fragment rerun")
    st.balloons()


with st.spinner("Inflating balloons..."):
    await asyncio.sleep(5)
release_the_balloons()
st.button("Inflate more balloons", help="Full rerun")
