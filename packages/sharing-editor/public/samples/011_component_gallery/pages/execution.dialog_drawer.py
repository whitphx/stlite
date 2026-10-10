import streamlit as st

@st.dialog("Details", position="right")
def show_details(item):
    st.write(f"Details for {item}")

if st.button("Open details"):
    show_details("Order #1234")
