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
from typing import Any, Dict, List

from streamlit import config

logger = logging.getLogger(__name__)

# Preserve the original sys.path so that the result of each call of _fix_sys_path() is not affected by the previous calls when rebooting the server.
orig_sys_path = sys.path.copy()


def _fix_sys_path(main_script_path: str) -> None:
    """Add the script's folder to the sys path.

    Python normally does this automatically, but since we exec the script
    ourselves we need to do it instead.
    """
    sys.path = orig_sys_path.copy()
    sys.path.insert(0, os.path.dirname(main_script_path))


def _fix_sys_argv(main_script_path: str, args: list[str]) -> None:
    """sys.argv needs to exclude streamlit arguments and parameters
    and be set to what a user's script may expect.
    """
    import sys

    sys.argv = [main_script_path] + list(args)


def _fix_pydeck_mapbox_api_warning() -> None:
    """Sets MAPBOX_API_KEY environment variable needed for
    PyDeck otherwise it will throw an exception"""

    os.environ["MAPBOX_API_KEY"] = config.get_option("mapbox.token")


def load_config_options(flag_options: Dict[str, Any], multi_runtime=False) -> None:
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
    # Stlite: set `force_reparse=False` in the shared worker mode, where there are multiple runtimes.
    # If `force_reparse=True`, `config.get_config_options()` always reparse the config files and sends the `_on_config_parsed` signal,
    # which leads to send the `script_changed_on_disk` message to all frontend apps.
    # It leads to display the "Source file changed. [Rerun] [Always Rerun]" message
    # in every connected frontend and it's annoying.
    # Also, the `config` module holds the config object as a module-level variable,
    # so it can't manage different configs for each runtime and it doesn't work well in the shared worker mode anyway.
    # For the second problem, at this moment, we gave up to fix it and leave the `config` module as not multi runtime-compatible.
    # TODO: Fix the `config` module to be multi runtime-compatible.
    config.get_config_options(
        force_reparse=not multi_runtime, options_from_flags=options_from_flags
    )


def _fix_altair():
    """Install custom finder and importer to patch Altair when it's imported.
    The patch fixes an issue with Altair and the mocked pyarrow module of stlite.
    """

    # The original patch is https://github.com/whitphx/stlite/blob/v0.47.0/packages/kernel/py/stlite-server/stlite_server/bootstrap.py#L127-L144.  # noqa: E501
    # Since Streamlit 1.32.0, it lazy-loads the Altair module for performance reasons,
    # so we introduced a custom finder and loader to execute the patch
    # upon the lazy-import of Altair as below.
    # NOTE: After I wrote this code, I found https://pypi.org/project/importhook/,
    #       which is for this purpose.
    #       While I keep this code for now because its implementation is simpler
    #       and works well for our purpose,
    #       we may want to consider using the library in the future.
    from importlib.abc import MetaPathFinder
    from importlib.machinery import PathFinder, SourceFileLoader

    class AltairCustomFinder(MetaPathFinder):
        def find_spec(self, fullname, path, target=None):
            if fullname == "altair.utils._importers":
                spec = PathFinder.find_spec(fullname, path, target)
                if spec is not None and spec.origin is not None:
                    spec.loader = AltairCustomLoader(spec.name, spec.origin)
                    return spec

    class AltairCustomLoader(SourceFileLoader):
        def create_module(self, spec):
            # Return None to use the default module creation process
            return None

        def exec_module(self, module):
            super().exec_module(module)

            self.patch_module(module)
            logger.debug(f"{module.__name__} has been patched.")

        def patch_module(self, module):
            def _pyarrow_available():
                return False

            module.pyarrow_available = _pyarrow_available

            def _import_pyarrow_interchange():
                raise ImportError("Pyarrow is not available in stlite.")

            module.import_pyarrow_interchange = _import_pyarrow_interchange

    finder = AltairCustomFinder()
    sys.meta_path.insert(0, finder)


def _fix_requests():
    try:
        import pyodide_http  # type: ignore[import]

        pyodide_http.patch_all()  # Patch all libraries
    except ImportError:
        # pyodide_http is not installed. No need to do anything.
        pass


def prepare(
    main_script_path: str,
    args: List[str],
) -> None:
    """Prepare the environment for the stlite runtime.

    This method is based on streamlit.web.bootstrap.run()
    but omitting the server initialization.
    """
    _fix_sys_path(main_script_path)
    _fix_altair()
    _fix_requests()
    _fix_sys_argv(main_script_path, args)
    _fix_pydeck_mapbox_api_warning()
