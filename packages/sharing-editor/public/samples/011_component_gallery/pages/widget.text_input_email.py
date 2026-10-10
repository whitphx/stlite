import streamlit as st

email = st.text_input("Email", type="email")
if email:
    st.write("We'll reach you at", email)
