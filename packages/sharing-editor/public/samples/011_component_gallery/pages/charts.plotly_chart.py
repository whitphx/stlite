import plotly.figure_factory as ff
import streamlit as st
from numpy.random import default_rng as rng

hist_data = [
    rng(0).standard_normal(200) - 2,
    rng(1).standard_normal(200),
    rng(2).standard_normal(200) + 2,
]
group_labels = ["Group 1", "Group 2", "Group 3"]

fig = ff.create_distplot(hist_data, group_labels, bin_size=[0.1, 0.25, 0.5])

st.plotly_chart(fig)
