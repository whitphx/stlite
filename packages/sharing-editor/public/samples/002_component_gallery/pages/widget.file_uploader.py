import streamlit as st

uploaded_files = st.file_uploader("Choose a file", accept_multiple_files=True)

for uploaded_file in uploaded_files:
    st.write("filename:", uploaded_file.name)
