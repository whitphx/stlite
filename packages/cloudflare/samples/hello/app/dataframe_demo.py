# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2026)
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

from urllib.error import URLError

import pandas as pd

import streamlit as st
from utils import show_code


def data_frame_demo() -> None:
    @st.cache_data
    def get_un_data() -> pd.DataFrame:
        # aws_bucket_url = "https://streamlit-demo-data.s3-us-west-2.amazonaws.com"
        # df = pd.read_csv(aws_bucket_url + "/agri.csv.gz")
        df = pd.read_csv("./agri.csv.gz")
        return df.set_index("Region")  # type: ignore[no-any-return, unused-ignore]

    try:
        df = get_un_data()
        countries = st.multiselect(
            "Choose countries", list(df.index), ["China", "United States of America"]
        )
        if not countries:
            st.error("Please select at least one country.")
        else:
            data = df.loc[countries]
            data /= 1000000.0
            st.subheader("Gross agricultural production ($B)")
            # Stlite: @stlite/cloudflare ships without pyarrow, so st.dataframe
            # and Arrow-backed charts are unavailable; render the table as text.
            st.text(data.sort_index().round(2).to_string())
    except URLError as e:
        st.error(f"This demo requires internet access. Connection error: {e.reason}")


st.set_page_config(page_title="DataFrame demo", page_icon=":material/table:")
st.title("DataFrame demo")
st.write(
    """
    This demo shows how to visualize a Pandas DataFrame.
    Data courtesy of the [UN Data Explorer](http://data.un.org/Explorer.aspx).
    """
)
st.info(
    "`@stlite/cloudflare` ships without pyarrow, so `st.dataframe` and "
    "Arrow-backed charts are unavailable here; the data is shown as text."
)
data_frame_demo()
show_code(data_frame_demo)
