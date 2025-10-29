import pandas as pd
import streamlit as st

uploaded_files = st.file_uploader(
    "Upload data", accept_multiple_files=True, type="csv"
)

for uploaded_file in uploaded_files:
    df = pd.read_csv(uploaded_file)
    st.write(df)
