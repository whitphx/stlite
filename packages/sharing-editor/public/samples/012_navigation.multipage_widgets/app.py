import streamlit as st

def page1():
    st.write(st.session_state.foo)

def page2():
    st.write(st.session_state.bar)

# Widgets shared by all the pages
st.sidebar.selectbox("Foo", ["A", "B", "C"], key="foo")
st.sidebar.checkbox("Bar", key="bar")

pg = st.navigation([st.Page(page1), st.Page(page2)])
pg.run()