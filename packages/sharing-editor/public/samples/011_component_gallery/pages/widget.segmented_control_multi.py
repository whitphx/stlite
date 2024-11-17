import streamlit as st

options = ["North", "East", "South", "West"]
selection = st.segmented_control(
    "Directions",
    options,
    selection_mode="multi"
)
st.markdown(f"Your selected options: {selection}.")
