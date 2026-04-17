import streamlit as st

cols = st.columns([2, 1, 2])
minimum = cols[0].number_input("Minimum", 1, 3)
maximum = cols[2].number_input("Maximum", 8, 10, 10)
value = cols[1].number_input("Default", 4, 7, 5)

st.slider("No key", minimum, maximum, value)
st.slider("With a key", minimum, maximum, value, key="a")
