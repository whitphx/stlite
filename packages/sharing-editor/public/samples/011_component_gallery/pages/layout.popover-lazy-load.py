import streamlit as st
import time

drawer = st.popover("Open popover", on_change="rerun")
with drawer:
    if drawer.open:
        with st.spinner("Loading popover..."):
            time.sleep(2)
        st.write("This is the popover")
