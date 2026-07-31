"""App-facing access to the Worker environment.

Streamlit apps conventionally read credentials from ``.streamlit/secrets.toml``,
which this deploy target refuses to package. The replacements both draw from
the Worker environment (wrangler ``vars`` for plain configuration, encrypted
secrets from ``wrangler secret put`` for sensitive values):

- ``st.secrets``: every string-valued environment entry is merged into
  Streamlit's secrets store before the app starts, so existing
  ``st.secrets["KEY"]`` code keeps working unchanged.
- :func:`get_env`: the Worker environment object itself, for non-string
  bindings (R2 buckets, KV namespaces, ...).
"""

from __future__ import annotations

import logging
from typing import Any

_LOGGER = logging.getLogger(__name__)


def get_env() -> Any:
    """Return the Worker environment (the Cloudflare bindings object).

    Sourced from the ``cloudflare:workers`` module-level binding, which is
    the same environment handlers receive — so this works identically in the
    plain-Worker and Durable Object deployments, and from anywhere in app
    code during a request.
    """
    from workers import import_from_javascript

    return import_from_javascript("cloudflare:workers").env


def install_worker_secrets() -> None:
    """Merge the environment's string-valued entries into ``st.secrets``.

    Non-string entries (the ASSETS binding, Durable Object namespaces, ...)
    are skipped; use :func:`get_env` for those.
    """
    import js
    from streamlit.runtime.secrets import secrets_singleton

    env = get_env()
    values: dict[str, str] = {}
    for key in js.Object.keys(env):
        value = getattr(env, key, None)
        if isinstance(value, str):
            values[str(key)] = value
    if values:
        secrets_singleton.merge_programmatic_secrets(values)
        _LOGGER.info(
            "Exposed %d Worker environment value(s) through st.secrets",
            len(values),
        )
