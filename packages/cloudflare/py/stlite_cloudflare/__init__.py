"""Stlite runtime for Cloudflare Python Workers.

App code may import :func:`get_env` for the Worker environment; everything
else lives in submodules consumed by the generated entrypoint.
"""

from stlite_cloudflare.worker_env import get_env

__all__ = ["get_env"]
