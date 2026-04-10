import base64
import pandas as pd
import streamlit as st


@st.cache_data
def load_audio_as_base64():
    with open("pages/cat-purr.mp3", "rb") as audio_file:
        audio_bytes = audio_file.read()
    return base64.b64encode(audio_bytes).decode("utf-8")


data_df = pd.DataFrame(
    {
        "source": [
            "Small and fluffy house panther",
            "Wikimedia, Performed by Muriel Nguyen Xuan and Stéphane Magnenat",
        ],
        "audio": [
            f"data:audio/mp3;base64,{load_audio_as_base64()}",
            "https://upload.wikimedia.org/wikipedia/commons/c/c4/Muriel-Nguyen-Xuan-Chopin-valse-opus64-1.ogg",
        ],
    }
)

st.dataframe(
    data_df,
    column_config={
        "audio": st.column_config.AudioColumn("Preview Audio"),
    },
)

st.caption(
    """
    ##### Audio credit:

    Performer: _Muriel Nguyen Xuan_ and _Stéphane Magnenat_

    Composer: Frédéric Chopin

    License: Creative Commons Attribution-Share Alike 4.0 International, 3.0 Unported, 2.5 Generic, 2.0 Generic and 1.0 Generic license.
    https://creativecommons.org/licenses/by-sa/4.0/

    URL:
    https://upload.wikimedia.org/wikipedia/commons/c/c4/Muriel-Nguyen-Xuan-Chopin-valse-opus64-1.ogg

"""
)
