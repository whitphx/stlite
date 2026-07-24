# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import io
import time
from typing import Any

import numpy as np
from PIL import Image

import streamlit as st
from streamlit.hello.utils import show_code


def animation_demo() -> None:
    # Interactive Streamlit elements, like these sliders, return their value.
    # This gives you an extremely simple interaction model.
    iterations = st.sidebar.slider("Level of detail", 2, 20, 10, 1)
    separation = st.sidebar.slider("Separation", 0.7, 2.0, 0.7885)

    # Non-interactive elements return a placeholder to their location
    # in the app. Here we're storing progress_bar to update it later.
    progress_bar = st.sidebar.progress(0)

    # These two elements will be filled in later, so we create a placeholder
    # for them using st.empty()
    frame_text = st.sidebar.empty()
    image = st.empty()

    # Pre-render the sweep into a single looping GIF instead of replacing the
    # image once per frame: on the single-threaded Pyodide runtime the browser
    # fetches each replaced frame slower than the script produces the next
    # one, so per-frame media files get dropped before their fetch arrives.
    # One file, fetched once on an idle event loop, animates client-side.
    num_frames = 24
    m, n, s = 360, 240, 150
    x = np.linspace(-m / s, m / s, num=m).reshape((1, m))
    y = np.linspace(-n / s, n / s, num=n).reshape((n, 1))
    frames: list[Image.Image] = []

    for frame_num, a in enumerate(np.linspace(0.0, 4 * np.pi, num_frames)):
        # Here were setting value for these two elements.
        progress_bar.progress((frame_num + 1) / num_frames)
        frame_text.text(f"Rendering frame {frame_num + 1}/{num_frames}")

        # Performing some fractal wizardry.
        c = separation * np.exp(1j * a)
        z = np.tile(x, (n, 1)) + 1j * np.tile(y, (1, m))
        c_matrix = np.full((n, m), c)
        m_matrix: Any = np.full((n, m), True, dtype=bool)
        n_matrix = np.zeros((n, m))

        for i in range(iterations):
            z[m_matrix] = z[m_matrix] * z[m_matrix] + c_matrix[m_matrix]
            m_matrix[np.abs(z) > 2] = False
            n_matrix[m_matrix] = i

        gray = (255 * (1.0 - n_matrix / n_matrix.max())).astype(np.uint8)
        frames.append(Image.fromarray(gray, mode="L"))

        # NOTE: We need to sleep for a bit in a loop on Stlite.
        # This is because we're using a single-threaded event loop, and
        # we need to give it a chance to process other events.
        time.sleep(0.05)

    buffer = io.BytesIO()
    frames[0].save(
        buffer,
        format="GIF",
        save_all=True,
        append_images=frames[1:],
        duration=100,
        loop=0,
    )
    image.image(buffer.getvalue(), width="content")

    # We clear elements by calling empty on them.
    progress_bar.empty()
    frame_text.empty()

    # Streamlit widgets automatically run the script from top to bottom. Since
    # this button is not connected to any other logic, it just causes a plain
    # rerun.
    st.button("Rerun")


st.set_page_config(page_title="Animation demo", page_icon=":material/animation:")
st.title("Animation demo")
st.write(
    """
    This app shows how you can use Streamlit to build cool animations.
    It displays an animated fractal based on the Julia Set. Use the slider
    to tune different parameters.
    """
)
animation_demo()
show_code(animation_demo)
