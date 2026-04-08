import streamlit as st

drawer = st.popover("Open popover", on_change="rerun")
with drawer:
    st.write("This is the popover")

st.space("large")
st.write(
    f"The popover is {':green[open]' if drawer.open else ':red[closed]'}."
)
