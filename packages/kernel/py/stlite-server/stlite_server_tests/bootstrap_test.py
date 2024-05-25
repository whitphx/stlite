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

from stlite_server import bootstrap


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


@patch("stlite_server.bootstrap.invalidate_pages_cache")
@patch("stlite_server.bootstrap.watch_dir")
def test_install_pages_watcher(patched_watch_dir, patched_invalidate_pages_cache):
    bootstrap._install_pages_watcher("/foo/bar/streamlit_app.py")

    args, _ = patched_watch_dir.call_args_list[0]
    on_pages_changed = args[1]

    patched_watch_dir.assert_called_once_with(
        "/foo/bar/pages",
        on_pages_changed,
        glob_pattern="*.py",
        allow_nonexistent=True,
    )

    on_pages_changed("/foo/bar/pages")
    patched_invalidate_pages_cache.assert_called_once()
