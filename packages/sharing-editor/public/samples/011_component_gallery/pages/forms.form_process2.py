import streamlit as st

if "sum" not in st.session_state:
    st.session_state.sum = ""


def sum():
    result = st.session_state.a + st.session_state.b
    st.session_state.sum = result


col1, col2 = st.columns(2)
col1.title("Sum:")
if isinstance(st.session_state.sum, float):
    col2.title(f"{st.session_state.sum:.2f}")

with st.form("addition"):
    st.number_input("a", key="a")
    st.number_input("b", key="b")
    st.form_submit_button("add", on_click=sum)
