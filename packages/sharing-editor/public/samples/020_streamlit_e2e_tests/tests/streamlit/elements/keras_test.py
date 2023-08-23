# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
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

"""Keras unit test."""

import unittest
from unittest.mock import patch

try:
    from tensorflow.python.keras.layers import Conv2D, Dense, Flatten, MaxPooling2D
    from tensorflow.python.keras.models import Sequential
    from tensorflow.python.keras.utils import vis_utils

    HAS_KERAS = True
except ImportError:
    HAS_KERAS = False

import streamlit as st


@unittest.skipIf(not HAS_KERAS, "Keras not installed")
class KerasTest(unittest.TestCase):
    """Test ability to marshall keras models."""

    def test_model(self):
        """Test that it can be called with a model."""
        model = Sequential()
        model.add(Conv2D(10, (5, 5), input_shape=(28, 28, 1), activation="relu"))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Flatten())
        model.add(Dense(8, activation="relu"))

        with patch(
            "streamlit.delta_generator.DeltaGenerator.graphviz_chart"
        ) as graphviz_chart:
            st.write(model)

            dot = vis_utils.model_to_dot(model)
            graphviz_chart.assert_called_once_with(dot.to_string())
