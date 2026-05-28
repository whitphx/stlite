"""Remnant of the legacy Tornado-style server emulation.

The original ``stlite_lib.server`` package implemented a hand-rolled HTTP/
WebSocket dispatcher and a handful of request handlers that mirrored
Streamlit's pre-Starlette server. All of that was retired when the JS
worker switched to driving upstream Streamlit's Starlette app directly
via the ASGI bridge (see ``stlite_lib.asgi_app``).

Only :mod:`stlite_lib.server.task_context` survives at this path because
upstream's customized ``streamlit.runtime.scriptrunner.script_runner``
still imports ``DirectorySyncCoroutineProxy`` from here, and the kernel
test harness still imports ``home_dir_contextvar`` from here. Moving
those would require a coordinated upstream-submodule patch and a
follow-up; for now we keep the path stable.
"""
