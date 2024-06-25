import streamlit as st
import altair as alt
import pandas as pd
from vega_datasets import data


@st.cache_data
def get_data():
    source = data.stocks()
    source = source[source.date.gt("2004-01-01")]
    return source


stock_data = get_data()

hover = alt.selection_single(
    fields=["date"],
    nearest=True,
    on="mouseover",
    empty="none",
)

lines = (
    alt.Chart(stock_data, title="Evolution of stock prices")
    .mark_line()
    .encode(
        x="date",
        y="price",
        color="symbol",
    )
)

points = lines.transform_filter(hover).mark_circle(size=65)

tooltips = (
    alt.Chart(stock_data)
    .mark_rule()
    .encode(
        x="yearmonthdate(date)",
        y="price",
        opacity=alt.condition(hover, alt.value(0.3), alt.value(0)),
        tooltip=[
            alt.Tooltip("date", title="Date"),
            alt.Tooltip("price", title="Price (USD)"),
        ],
    )
    .add_selection(hover)
)

data_layer = lines + points + tooltips


event_picker = alt.selection_point("events")


ANNOTATIONS = [
    ("Sep 01, 2007", 400, "🙂", "Something's going well for GOOG & AAPL."),
    ("Nov 01, 2008", 180, "🙂", "The market is recovering."),
    ("Dec 01, 2007", 700, "😱", "Something's going wrong for GOOG & AAPL."),
    ("Dec 01, 2009", 650, "😱", "A hiccup for GOOG."),
]
annotations_df = pd.DataFrame(
    ANNOTATIONS, columns=["date", "y", "marker", "description"]
)
annotations_df.date = pd.to_datetime(annotations_df.date)

annotation_layer = (
    alt.Chart(annotations_df)
    .mark_text(size=20, dx=-8, dy=-10, align="left")
    .encode(x="date:T", y=alt.Y("y:Q"), text="marker", tooltip="description")
)

combined_chart = data_layer + annotation_layer
st.altair_chart(combined_chart, use_container_width=True)