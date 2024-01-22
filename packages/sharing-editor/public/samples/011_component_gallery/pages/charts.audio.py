import numpy as np
import requests
import streamlit as st


@st.cache_data
def read_file_from_url(url):
    headers = {
        "User-Agent": "StreamlitDocs/1.5.0 (https://docs.streamlit.io; hello@streamlit.io)"
    }
    return requests.get(url, headers=headers).content


file_bytes = read_file_from_url(
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/Muriel-Nguyen-Xuan-Chopin-valse-opus64-1.ogg"
)

st.audio(file_bytes, format="audio/ogg")

st.write(
    """
    #### Audio credit:

    Performer: _Muriel Nguyen Xuan_ and _Stéphane Magnenat_

    Composer: Frédéric Chopin

    License: Creative Commons Attribution-Share Alike 4.0 International, 3.0 Unported, 2.5 Generic, 2.0 Generic and 1.0 Generic license.
    https://creativecommons.org/licenses/by-sa/4.0/

    URL:
    https://upload.wikimedia.org/wikipedia/commons/c/c4/Muriel-Nguyen-Xuan-Chopin-valse-opus64-1.ogg

"""
)

st.code(
    """
import streamlit as st
import numpy as np

sample_rate = 44100  # 44100 samples per second
seconds = 2  # Note duration of 2 seconds

frequency_la = 440  # Our played note will be 440 Hz

# Generate array with seconds*sample_rate steps, ranging between 0 and seconds
t = np.linspace(0, seconds, seconds * sample_rate, False)

# Generate a 440 Hz sine wave
note_la = np.sin(frequency_la * t * 2 * np.pi)
st.audio(note_la, sample_rate=sample_rate)
"""
)

sample_rate = 44100  # 44100 samples per second
seconds = 2  # Note duration of 2 seconds

frequency_la = 440  # Our played note will be 440 Hz

# Generate array with seconds*sample_rate steps, ranging between 0 and seconds
t = np.linspace(0, seconds, seconds * sample_rate, False)

# Generate a 440 Hz sine wave
note_la = np.sin(frequency_la * t * 2 * np.pi)
st.audio(note_la, sample_rate=sample_rate)
