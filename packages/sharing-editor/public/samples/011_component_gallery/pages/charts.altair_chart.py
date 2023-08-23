import altair as alt
import streamlit as st
from vega_datasets import data


@st.cache_data
def get_chart(use_container_width: bool):
    import altair as alt
    from vega_datasets import data

    source = data.cars()

    chart = (
        alt.Chart(source)
        .mark_circle()
        .encode(
            x="Horsepower",
            y="Miles_per_Gallon",
            color="Origin",
        )
        .interactive()
    )

    tab1, tab2 = st.tabs(["Streamlit theme (default)", "Altair native theme"])

    with tab1:
        st.altair_chart(
            chart, use_container_width=use_container_width, theme="streamlit"
        )
    with tab2:
        st.altair_chart(chart, use_container_width=use_container_width, theme=None)


try:
    get_chart(use_container_width=True)
except Exception as e:
    st.exception(e)
