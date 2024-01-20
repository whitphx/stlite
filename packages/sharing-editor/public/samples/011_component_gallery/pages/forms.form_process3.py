import streamlit as st

if "sum" not in st.session_state:
    st.session_state.sum = ""

col1, col2 = st.columns(2)
col1.title("Sum:")
if isinstance(st.session_state.sum, float):
    col2.title(f"{st.session_state.sum:.2f}")

with st.form("addition"):
    a = st.number_input("a")
    b = st.number_input("b")
    submit = st.form_submit_button("add")

# The value of st.session_state.sum is updated at the end of the script rerun,
# so the displayed value at the top in col2 does not show the new sum. Trigger
# a second rerun when the form is submitted to update the value above.
st.session_state.sum = a + b
if submit:
    st.rerun()
