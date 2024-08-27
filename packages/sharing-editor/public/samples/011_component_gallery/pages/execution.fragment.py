import streamlit as st

if "app_runs" not in st.session_state:
    st.session_state.app_runs = 0
    st.session_state.fragment_runs = 0


@st.fragment
def fragment():
    st.session_state.fragment_runs += 1
    st.button("Rerun fragment")
    st.write(f"Fragment says it ran {st.session_state.fragment_runs} times.")


st.session_state.app_runs += 1
fragment()
st.button("Rerun full app")
st.write(f"Full app says it ran {st.session_state.app_runs} times.")
st.write(f"Full app sees that fragment ran {st.session_state.fragment_runs} times.")
