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

"""LaTeX unit test."""

import streamlit as st
from tests.delta_generator_test_case import DeltaGeneratorTestCase


class LatexTest(DeltaGeneratorTestCase):
    """Test ability to marshall latex protos."""

    def test_latex(self):
        st.latex("ax^2 + bx + c = 0")

        c = self.get_delta_from_queue().new_element.markdown
        self.assertEqual(c.body, "$$\nax^2 + bx + c = 0\n$$")

    def test_sympy_expression(self):
        try:
            import sympy

            a, b = sympy.symbols("a b")
            out = a + b
        except:
            out = "a + b"

        st.latex(out)

        c = self.get_delta_from_queue().new_element.markdown
        self.assertEqual(c.body, "$$\na + b\n$$")
