import streamlit as st

summary = st.expander("Summary", on_change="rerun")
with summary:
    st.write("This is the summary")

st.write(
    f"The expander is {':green[open]' if summary.open else ':red[closed]'}."
)
