import streamlit as st

uploaded_files = st.file_uploader(
    "Upload images", accept_multiple_files="directory", type=["jpg", "png"]
)
for uploaded_file in uploaded_files:
    st.image(uploaded_file)
