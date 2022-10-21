import streamlit as st
import cv2
import numpy as np

st.title("OpenCV sample")

input_mode = st.radio("Input mode", ["Sample", "Camera", "Upload"])
if input_mode == "Sample":
    img = cv2.imread("data/logo.png")
else:
    st.info("""
        Don't worry! The photo data is processed on your browser
        and never uploaded to any remote servers.
    """)
    bytes_data = None
    if input_mode == "Camera":
        img_file_buffer = st.camera_input("Take a picture")
        if img_file_buffer is not None:
            bytes_data = img_file_buffer.getvalue()
    else:
        uploaded_file = st.file_uploader("Choose an image file", type=['png', 'jpg'])
        if uploaded_file is not None:
            bytes_data = uploaded_file.getvalue()
    if bytes_data is None:
        st.stop()
    img = cv2.imdecode(np.frombuffer(bytes_data, np.uint8), cv2.IMREAD_COLOR)

if img is None:
    st.stop()

st.header("Preview")
st.image(img, channels="BGR")

st.header("Blur")
ksize = st.slider("Kernel size", 1, 100, value=10)
img = cv2.blur(img, (ksize, ksize))

st.image(img, channels="BGR")
