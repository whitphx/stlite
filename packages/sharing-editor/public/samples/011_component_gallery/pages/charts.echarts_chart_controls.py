import streamlit as st

st.echarts_chart(
    {
        "legend": {"data": ["Revenue", "Cost"], "top": 28},
        "tooltip": {"trigger": "axis"},
        "toolbox": {
            "left": 0,
            "feature": {
                "magicType": {"type": ["line", "bar"]},
                "restore": {},
            },
        },
        "dataZoom": [
            {"type": "inside"},
            {"type": "slider"},
        ],
        "xAxis": {
            "type": "category",
            "data": ["Q1", "Q2", "Q3", "Q4"],
        },
        "yAxis": {"type": "value"},
        "series": [
            {
                "name": "Revenue",
                "type": "line",
                "data": [820, 932, 901, 934],
            },
            {
                "name": "Cost",
                "type": "bar",
                "data": [500, 610, 550, 700],
            },
        ],
    }
)
