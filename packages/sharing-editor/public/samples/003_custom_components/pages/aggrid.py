"""
This sample code has been copied from
https://github.com/PablocFonseca/streamlit-aggrid
"""

from st_aggrid import AgGrid
import pandas as pd
import pyodide.http  # urllib or requests cannot be used in the Pyodide environment where stlite runs, so we use `pyodide.http` module instead. See https://pyodide.org/en/stable/usage/faq.html#how-can-i-load-external-files-in-pyodide

# df = pd.read_csv('https://raw.githubusercontent.com/fivethirtyeight/data/master/airline-safety/airline-safety.csv')
df = pd.read_csv(pyodide.http.open_url('https://raw.githubusercontent.com/fivethirtyeight/data/master/airline-safety/airline-safety.csv'))
AgGrid(df)
