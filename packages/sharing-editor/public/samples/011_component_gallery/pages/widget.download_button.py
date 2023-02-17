import streamlit as st
import pandas as pd
import numpy as np

@st.cache_data
def load_data():
    data = pd.DataFrame(
        np.random.randn(1000, 2),
        columns=['a', 'b'])

    return data

@st.cache_data
def convert_df(df):
    # IMPORTANT: Cache the conversion to prevent computation on every rerun
    return df.to_csv().encode('utf-8')

my_large_df = load_data()
csv = convert_df(my_large_df)

st.download_button(
     label="Download data as CSV",
     data=csv,
     file_name='large_df.csv',
     mime='text/csv',
 )

text_contents = '''This is some text'''
st.download_button('Download some text', text_contents)

binary_contents = b'example content'
# Defaults to 'application/octet-stream'
st.download_button('Download binary file', binary_contents)

with open("pages/flower.png", "rb") as file:
    btn = st.download_button(
        label="Download image",
        data=file,
        file_name="flower.png",
        mime="image/png"
    )
