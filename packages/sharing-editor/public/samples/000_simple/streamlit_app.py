import streamlit as st
from PIL import Image

st.title("Main page")

image = Image.open('data/logo.png')
st.image(image, caption='stlite logo')

name = st.text_input("Your name?")
st.write("Hello,", name or "world", "!")
