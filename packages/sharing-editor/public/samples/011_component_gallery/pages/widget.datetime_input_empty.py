import datetime
import streamlit as st

event_time = st.datetime_input("Schedule your event", value=None)
st.write("Event scheduled for", event_time)
