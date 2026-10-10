import streamlit as st

st.echarts_chart(
    {
        "xAxis": {"type": "category", "data": ["A", "B", "C", "D", "E"]},
        "yAxis": {"type": "value"},
        "series": [{"type": "bar", "data": [5, 20, 36, 10, 10]}],
    }
)
