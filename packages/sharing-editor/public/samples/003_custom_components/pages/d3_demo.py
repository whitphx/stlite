"""
This sample code has been copied from
https://github.com/andfanilo/streamlit-d3-demo
"""

import random
from streamlit_d3_demo import d3_line

def generate_random_data(x_r, y_r):
    return list(zip(range(x_r), [random.randint(0, y_r) for _ in range(x_r)]))

d3_line(generate_random_data(20, 500), circle_radius=15, circle_color="#6495ed")
