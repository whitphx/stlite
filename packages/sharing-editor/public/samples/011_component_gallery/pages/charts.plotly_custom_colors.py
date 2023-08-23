import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


@st.cache_data
def get_chart_1111(use_conatiner_width: bool):
    st.subheader("Define a custom colorscale")
    df = px.data.iris()  # replace with your own data source
    fig = px.scatter(
        df,
        x="sepal_width",
        y="sepal_length",
        color="sepal_length",
        color_continuous_scale="reds",
    )

    tab1, tab2 = st.tabs(["Streamlit theme (default)", "Plotly native theme"])
    with tab1:
        st.plotly_chart(fig, use_conatiner_width=use_conatiner_width, theme="streamlit")
    with tab2:
        st.plotly_chart(fig, use_conatiner_width=use_conatiner_width, theme=None)


try:
    get_chart_1111(use_conatiner_width=True)
except Exception as e:
    st.exception(e)
