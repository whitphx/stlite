import random
from datetime import date

import numpy as np
import pandas as pd
import streamlit as st

st.set_page_config("Profiles", "👤")


@st.cache_data
def get_profile_dataset(number_of_items: int = 100, seed: int = 0) -> pd.DataFrame:
    new_data = []

    def calculate_age(born):
        today = date.today()
        return (
            today.year - born.year - ((today.month, today.day) < (born.month, born.day))
        )

    from faker import Faker

    fake = Faker()
    random.seed(seed)
    Faker.seed(seed)

    for i in range(number_of_items):
        profile = fake.profile()
        new_data.append(
            {
                "avatar": f"https://picsum.photos/400/200?lock={i}",
                "name": profile["name"],
                "age": calculate_age(profile["birthdate"]),
                "active": random.choice([True, False]),
                "daily_activity": np.random.rand(25),
                "homepage": profile["website"][0],
                "email": profile["mail"],
                "activity": np.random.randint(2, 90, size=25),
                "gender": random.choice(["male", "female", "other", None]),
                "birthdate": profile["birthdate"],
                "status": round(random.uniform(0, 1), 2),
            }
        )

    profile_df = pd.DataFrame(new_data)
    profile_df["gender"] = profile_df["gender"].astype("category")
    return profile_df


column_configuration = {
    "name": st.column_config.TextColumn(
        "Name", help="The name of the user", max_chars=100
    ),
    "avatar": st.column_config.ImageColumn("Avatar", help="The user's avatar"),
    "active": st.column_config.CheckboxColumn("Is Active?", help="Is the user active?"),
    "homepage": st.column_config.LinkColumn(
        "Homepage", help="The homepage of the user"
    ),
    "gender": st.column_config.SelectboxColumn(
        "Gender", options=["male", "female", "other"]
    ),
    "age": st.column_config.NumberColumn(
        "Age",
        min_value=0,
        max_value=120,
        format="%d years",
        help="The user's age",
    ),
    "activity": st.column_config.LineChartColumn(
        "Activity (1 year)",
        help="The user's activity over the last 1 year",
        width="large",
        y_min=0,
        y_max=100,
    ),
    "daily_activity": st.column_config.BarChartColumn(
        "Activity (daily)",
        help="The user's activity in the last 25 days",
        width="medium",
        y_min=0,
        y_max=1,
    ),
    "status": st.column_config.ProgressColumn(
        "Status", min_value=0, max_value=1, format="%.2f"
    ),
    "birthdate": st.column_config.DateColumn(
        "Birthdate",
        help="The user's birthdate",
        min_value=date(1920, 1, 1),
    ),
    "email": st.column_config.TextColumn(
        "Email",
        help="The user's email address",
        validate="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
    ),
}

st.data_editor(
    get_profile_dataset(),
    column_config=column_configuration,
    use_container_width=True,
    hide_index=True,
    num_rows="fixed",
)
