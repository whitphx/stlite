import streamlit as st
import time


def make_report():
    time.sleep(1)
    return "col1,col2\n1,2\n3,4".encode("utf-8")


st.download_button(
    label="Download report",
    data=make_report,
    file_name="report.csv",
    mime="text/csv",
)
