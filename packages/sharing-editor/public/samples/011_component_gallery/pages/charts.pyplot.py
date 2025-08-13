import matplotlib.pyplot as plt
import streamlit as st
from numpy.random import default_rng as rng

arr = rng(0).normal(1, 1, size=100)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)
