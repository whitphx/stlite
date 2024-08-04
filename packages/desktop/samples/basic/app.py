import streamlit as st
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt

st.title("Streamlit Sample Desktop App")

st.write("Hello World")

st.image("https://static.streamlit.io/examples/cat.jpg", caption="Cute cat")

df = pd.read_csv("./data/table.csv")
st.dataframe(df)

bins = st.slider("Number of bins", min_value=1, max_value=50, value=20)
arr = np.random.normal(1, 1, size=100)
fig, ax = plt.subplots()
ax.hist(arr, bins=bins)
st.pyplot(fig)
