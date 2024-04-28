import streamlit as st

popover = st.popover("Filter items")
red = popover.checkbox("Show red items.", True)
blue = popover.checkbox("Show blue items.", True)

if red:
    st.write(":red[This is a red item.]")
if blue:
    st.write(":blue[This is a blue item.]")
