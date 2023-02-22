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

# This module is reproduction of streamlit.web.bootstrap for the stlite runtime.
# We picked up some code snippets necessary for the stlite runtime from that module.

import logging
import os
import sys
from pathlib import Path
from typing import Any, Dict, List

from streamlit import config
from streamlit.source_util import invalidate_pages_cache
from streamlit.watcher import watch_dir

logger = logging.getLogger(__name__)


def _fix_sys_path(main_script_path: str) -> None:
    """Add the script's folder to the sys path.

    Python normally does this automatically, but since we exec the script
    ourselves we need to do it instead.
    """
    sys.path.insert(0, os.path.dirname(main_script_path))


def _fix_matplotlib_crash() -> None:
    """Set Matplotlib backend to avoid a crash.

    The default Matplotlib backend crashes Python on OSX when run on a thread
    that's not the main thread, so here we set a safer backend as a fix.
    Users can always disable this behavior by setting the config
    runner.fixMatplotlib = false.

    This fix is OS-independent. We didn't see a good reason to make this
    Mac-only. Consistency within Streamlit seemed more important.
    """
    if config.get_option("runner.fixMatplotlib"):
        try:
            # TODO: a better option may be to set
            #  os.environ["MPLBACKEND"] = "Agg". We'd need to do this towards
            #  the top of __init__.py, before importing anything that imports
            #  pandas (which imports matplotlib). Alternately, we could set
            #  this environment variable in a new entrypoint defined in
            #  setup.py. Both of these introduce additional trickiness: they
            #  need to run without consulting streamlit.config.get_option,
            #  because this would import streamlit, and therefore matplotlib.
            import matplotlib

            matplotlib.use("Agg")
        except ImportError:
            # Matplotlib is not installed. No need to do anything.
            pass


def _fix_sys_argv(main_script_path: str, args: List[str]) -> None:
    """sys.argv needs to exclude streamlit arguments and parameters
    and be set to what a user's script may expect.
    """
    import sys

    sys.argv = [main_script_path] + list(args)


def _fix_pydeck_mapbox_api_warning() -> None:
    """Sets MAPBOX_API_KEY environment variable needed for
    PyDeck otherwise it will throw an exception"""

    os.environ["MAPBOX_API_KEY"] = config.get_option("mapbox.token")


def load_config_options(flag_options: Dict[str, Any]) -> None:
    """Load config options from config.toml files, then overlay the ones set by
    flag_options.

    The "streamlit run" command supports passing Streamlit's config options
    as flags. This function reads through the config options set via flag,
    massages them, and passes them to get_config_options() so that they
    overwrite config option defaults and those loaded from config.toml files.

    Parameters
    ----------
    flag_options : Dict[str, Any]
        A dict of config options where the keys are the CLI flag version of the
        config option names.
    """
    options_from_flags = {
        name.replace("_", "."): val
        for name, val in flag_options.items()
        if val is not None
    }

    # Force a reparse of config files (if they exist). The result is cached
    # for future calls.
    config.get_config_options(force_reparse=True, options_from_flags=options_from_flags)


def _install_pages_watcher(main_script_path_str: str) -> None:
    def _on_pages_changed(_path: str) -> None:
        invalidate_pages_cache()

    main_script_path = Path(main_script_path_str)
    pages_dir = main_script_path.parent / "pages"

    watch_dir(
        str(pages_dir),
        _on_pages_changed,
        glob_pattern="*.py",
        allow_nonexistent=True,
    )


def prepare(
    main_script_path: str,
    args: List[str],
) -> None:
    """Prepare the environment for the stlite runtime.

    This method is based on streamlit.web.bootstrap.run()
    but omitting the server initialization.
    """
    _fix_sys_path(main_script_path)
    _fix_matplotlib_crash()
    _fix_sys_argv(main_script_path, args)
    _fix_pydeck_mapbox_api_warning()
    _install_pages_watcher(main_script_path)
