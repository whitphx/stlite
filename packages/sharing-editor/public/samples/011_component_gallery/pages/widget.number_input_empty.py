import streamlit as st

number = st.number_input("Insert a number", value=None, placeholder="Type a number...")
st.write("The current number is ", number)
