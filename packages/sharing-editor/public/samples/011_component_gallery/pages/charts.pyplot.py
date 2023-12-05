import matplotlib.pyplot as plt
import numpy as np
import streamlit as st


@st.cache_data
def load_fig():
    arr = np.random.normal(1, 1, size=100)
    fig, ax = plt.subplots()
    ax.hist(arr, bins=20)
    return fig, ax


fig, ax = load_fig()

st.pyplot(fig)
