import streamlit as st

if "script_runs" not in st.session_state:
    st.session_state.script_runs = 0
    st.session_state.fragment_runs = 0


@st.experimental_fragment
def fragment():
    st.session_state.fragment_runs += 1
    st.button("Rerun fragment")
    st.write(f"Fragment says it ran {st.session_state.fragment_runs} times.")


st.session_state.script_runs += 1
fragment()
st.button("Rerun full script")
st.write(f"Full script says it ran {st.session_state.script_runs} times.")
st.write(f"Full script sees that fragment ran {st.session_state.fragment_runs} times.")
