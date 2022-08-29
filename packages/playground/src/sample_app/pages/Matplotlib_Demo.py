import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

st.set_page_config(page_title="Matplotlib Demo")

st.title("Matplotlib Demo")
st.write(
    """This demo is just copied from
    [the official `st.pyplot` API reference page](https://docs.streamlit.io/library/api-reference/charts/st.pyplot)
    """
)


size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)
