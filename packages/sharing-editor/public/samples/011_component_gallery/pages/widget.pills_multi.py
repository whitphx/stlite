import streamlit as st

options = ["North", "East", "South", "West"]
selection = st.pills(
    "Directions",
    options,
    selection_mode="multi"
)
st.markdown(f"Your selected options: {selection}.")
