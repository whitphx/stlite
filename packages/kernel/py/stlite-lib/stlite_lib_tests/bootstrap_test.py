# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
# Copyright (c) Yuichiro Tachibana (Tsuchiya) (2023)
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

# We copied necessary test cases from
# streamlit/lib/tests/streamlit/web/bootstrap_test.py

from unittest.mock import patch

from stlite_lib import bootstrap


@patch("streamlit.config.get_config_options")
def test_load_config_options(patched_get_config_options):
    """Test that bootstrap.load_config_options parses the keys properly and
    passes down the parameters.
    """

    flag_options = {
        "server_port": 3005,
        "server_headless": True,
        "browser_serverAddress": "localhost",
        "logger_level": "error",
        # global_minCachedMessageSize shouldn't be set below since it's None.
        "global_minCachedMessageSize": None,
    }

    bootstrap.load_config_options(flag_options)

    patched_get_config_options.assert_called_once_with(
        force_reparse=True,
        options_from_flags={
            "server.port": 3005,
            "server.headless": True,
            "browser.serverAddress": "localhost",
            "logger.level": "error",
        },
    )


def _altair_finders():
    import sys

    return [f for f in sys.meta_path if type(f).__name__ == "AltairCustomFinder"]


def test_fix_altair_patches_altair_against_the_pyarrow_stub(monkeypatch):
    import sys

    from stlite_lib.runtime_init import mock_pyarrow

    monkeypatch.setattr(sys, "meta_path", list(sys.meta_path))
    monkeypatch.delitem(sys.modules, "pyarrow", raising=False)
    mock_pyarrow()

    bootstrap._fix_altair()

    assert len(_altair_finders()) == 1


def test_fix_altair_leaves_altair_alone_without_the_stub(monkeypatch):
    import sys
    import types

    monkeypatch.setattr(sys, "meta_path", list(sys.meta_path))
    # The browser runtime: pyarrow is either not imported yet or the real one.
    monkeypatch.delitem(sys.modules, "pyarrow", raising=False)
    bootstrap._fix_altair()
    monkeypatch.setitem(sys.modules, "pyarrow", types.ModuleType("pyarrow"))
    bootstrap._fix_altair()

    assert _altair_finders() == []
