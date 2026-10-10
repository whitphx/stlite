import streamlit as st

st.mermaid_chart('''
    graph LR
        A[Start] --> B{Decision}
        B -->|Yes| C[OK]
        B -->|No| D[Cancel]
''')
