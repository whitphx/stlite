import streamlit as st
from PIL import Image

st.title("Main page")

image = Image.open('data/logo.png')
st.image(image, caption='stlite logo')
