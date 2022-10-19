"""
This sample code has been copied from
https://github.com/andfanilo/streamlit-lottie
"""

import time
# import requests
import json

import streamlit as st
from streamlit_lottie import st_lottie
from streamlit_lottie import st_lottie_spinner

import pyodide.http  # urllib or requests cannot be used in the Pyodide environment where stlite runs, so we use `pyodide.http` module instead. See https://pyodide.org/en/stable/usage/faq.html#how-can-i-load-external-files-in-pyodide


def load_lottieurl(url: str):
    return json.loads(pyodide.http.open_url(url).getvalue())


lottie_url_hello = "https://assets5.lottiefiles.com/packages/lf20_V9t630.json"
lottie_url_download = "https://assets4.lottiefiles.com/private_files/lf30_t26law.json"
lottie_hello = load_lottieurl(lottie_url_hello)
lottie_download = load_lottieurl(lottie_url_download)


st_lottie(lottie_hello, key="hello")

if st.button("Download"):
    with st_lottie_spinner(lottie_download, key="download"):
        time.sleep(5)
    st.balloons()
