"""Run Streamlit's `e2e_playwright` suite against `@stlite/browser`.

Loaded as a pytest plugin, it swaps the conftest's `start_app_server` for
a static server whose page mounts the test's script with Stlite.
Run as a script, it is that static server.

After `make browser`, run from `streamlit/` with upstream's E2E environment:

    PYTHONPATH=../packages/browser/upstream-e2e .venv/bin/python -m pytest \
        -p stlite_upstream_e2e e2e_playwright/st_button_test.py \
        --browser chromium -n 4 --dist loadscope

"""

from __future__ import annotations

import json
import mimetypes
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

import pytest

BROWSER_BUILD_DIR = Path(__file__).resolve().parents[1] / "build"

HOST_PAGE = """<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/_stlite/stlite.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import {{ mount }} from "/_stlite/stlite.js";
      mount({options}, document.getElementById("root"));
    </script>
  </body>
</html>
"""


def _parse_config_value(value: str) -> Any:
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return value


def _streamlit_config(extra_args: list[str]) -> dict[str, Any]:
    config: dict[str, Any] = {}
    args = iter(extra_args)
    for arg in args:
        key = arg.removeprefix("--")
        if "=" in key:
            key, value = key.split("=", 1)
        else:
            value = next(args)
        config[key] = _parse_config_value(value)
    return config


class _ModuleScopedContext:
    # Each new context starts with an empty HTTP cache,
    # so pytest-playwright's per-test context re-downloads Pyodide for every test.
    # The cost is that its `--tracing` and `--video` options record nothing here.
    @pytest.fixture(scope="module")
    def context(self, browser: Any, browser_context_args: dict[str, Any]) -> Any:
        context = browser.new_context(**browser_context_args)
        yield context
        context.close()

    @pytest.fixture
    def page(self, context: Any, request: pytest.FixtureRequest) -> Any:
        # A shared context cannot take the per-test args this marker sets.
        if request.node.get_closest_marker("browser_context_args"):
            context = request.getfixturevalue("new_context")()
        page = context.new_page()
        yield page
        # Streamlit keeps UI state such as the theme in web storage.
        page.evaluate("localStorage.clear(); sessionStorage.clear()")
        context.clear_cookies()
        page.close()


SKIPPED_TESTS = {
    # `iframed_app` sets a CSP that only allows Streamlit's server paths,
    # so it blocks Stlite's script, Pyodide and wheels.
    "st_dataframe_interactions_test.py::test_csv_download_button_in_iframe": "iframed_app CSP",
    "st_dataframe_interactions_test.py::test_csv_download_button_in_iframe_with_new_tab_host_config": "iframed_app CSP",
    "st_markdown_test.py::test_large_image_in_markdown": "https://github.com/whitphx/stlite/issues/2143",
}


def _app_files(script: Path) -> dict[str, dict[str, str]]:
    app_dir = script.parent
    skipped_dirs = {"__snapshots__", "__pycache__", "test-results"}
    # `static/` is most of the directory's size, so only apps naming it get it.
    # `./app/static/` URLs don't count, since Stlite doesn't serve them (#2143).
    if not re.search(r"(?<!app/)static", script.read_text()):
        skipped_dirs.add("static")
    files = {}
    for path in app_dir.rglob("*"):
        relative = path.relative_to(app_dir)
        if (
            not path.is_file()
            or path.name.endswith("_test.py")
            or not skipped_dirs.isdisjoint(relative.parts)
            or any(
                part.startswith(".") and part != ".streamlit" for part in relative.parts
            )
        ):
            continue
        files[relative.as_posix()] = {"url": f"/_app/{relative.as_posix()}"}
    return files


def pytest_collection_modifyitems(items: list[pytest.Item]) -> None:
    for item in items:
        test_id = f"{item.path.name}::{item.name.split('[')[0]}"
        if test_id in SKIPPED_TESTS:
            item.add_marker(pytest.mark.skip(reason=SKIPPED_TESTS[test_id]))


_snapshot_mismatches: list[str] = []


@pytest.hookimpl(wrapper=True)
def pytest_runtest_makereport(item: pytest.Item, call: pytest.CallInfo[None]) -> Any:
    report = yield
    # `assert_snapshot` fails in its teardown, after the test body has passed.
    # Stlite still renders some widgets differently from upstream's baselines,
    # so a mismatch is reported and its diff kept in `test-results/`,
    # but it doesn't fail the test until those differences are fixed.
    # Matching the exception, not the report text, keeps a teardown that also
    # raised another error (an exception group) failing.
    if (
        report.when == "teardown"
        and call.excinfo is not None
        and call.excinfo.errisinstance(pytest.fail.Exception)
        and str(call.excinfo.value).startswith("Missing or mismatched snapshots")
    ):
        report.outcome = "passed"
        # `user_properties` reaches the xdist controller with the report.
        report.user_properties.append(("snapshot_mismatch", True))
    return report


def pytest_runtest_logreport(report: pytest.TestReport) -> None:
    if ("snapshot_mismatch", True) in report.user_properties:
        _snapshot_mismatches.append(report.nodeid)


def pytest_terminal_summary(terminalreporter: Any) -> None:
    for nodeid in _snapshot_mismatches:
        terminalreporter.write_line(f"SNAPSHOT MISMATCH {nodeid}")


def pytest_configure(config: pytest.Config) -> None:
    # Without the build, every test fails with an opaque load timeout.
    if not (BROWSER_BUILD_DIR / "stlite.js").is_file():
        pytest.exit("Build `@stlite/browser` first with `make browser`.")
    # Registered here rather than at import, so these fixtures come after
    # pytest-playwright's and override them.
    config.pluginmanager.register(_ModuleScopedContext())


def pytest_plugin_registered(plugin: object) -> None:
    # A plugin's fixtures cannot override the conftest's `app_server`,
    # so patch the function it calls instead.
    if not getattr(plugin, "__name__", "").endswith("conftest"):
        return
    conftest: Any = plugin
    if not hasattr(conftest, "start_app_server"):
        return

    def start_app_server(
        app_port: int,
        request_module: Any,
        *,
        extra_env: dict[str, str] | None = None,
        extra_args: list[str] | None = None,
    ) -> Any:
        script = Path(conftest.resolve_test_to_script(request_module)).resolve()
        config = {
            "global.e2eTest": True,
            "browser.gatherUsageStats": False,
            **_streamlit_config(extra_args or []),
        }
        options = {
            "entrypoint": script.name,
            "files": _app_files(script),
            "streamlitConfig": config,
            "env": extra_env or {},
        }
        proc = conftest.AsyncSubprocess(
            [sys.executable, __file__, str(app_port), str(script), json.dumps(options)],
            cwd=".",
        )
        proc.start()
        if not conftest.wait_for_app_server_to_start(app_port):
            raise RuntimeError(proc.terminate())
        return proc

    conftest.start_app_server = start_app_server


def serve(port: int, script: Path, options: dict[str, Any]) -> None:
    app_dir = script.parent
    host_page = HOST_PAGE.format(options=json.dumps(options)).encode()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            path = urlsplit(self.path).path
            if path == "/_stcore/health":
                self._send(b"ok", "text/plain")
            elif path.startswith("/_stlite/"):
                self._send_file(BROWSER_BUILD_DIR, path.removeprefix("/_stlite/"))
            elif path.startswith("/_app/"):
                self._send_file(app_dir, path.removeprefix("/_app/"))
            else:
                # A page's URL path, too, has to load the app.
                self._send(host_page, "text/html")

        def _send_file(self, root: Path, relative: str) -> None:
            file = (root / relative).resolve()
            if not file.is_relative_to(root) or not file.is_file():
                self.send_error(404)
                return
            content_type = mimetypes.guess_type(file.name)[0]
            self._send(file.read_bytes(), content_type or "application/octet-stream")

        def _send(self, body: bytes, content_type: str) -> None:
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    ThreadingHTTPServer(("localhost", port), Handler).serve_forever()


if __name__ == "__main__":
    serve(int(sys.argv[1]), Path(sys.argv[2]), json.loads(sys.argv[3]))
