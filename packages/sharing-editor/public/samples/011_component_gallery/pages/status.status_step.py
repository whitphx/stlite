import time

import streamlit as st

with st.status("Loading data", type="step"):
    time.sleep(1)
    st.write("Loaded 1,234 records.")

with st.status("Analyzing data", type="step"):
    time.sleep(1)
    st.write("Found 3 anomalies.")

# A step with no content terminates the timeline.
st.status("Report ready", state="complete", type="step")
