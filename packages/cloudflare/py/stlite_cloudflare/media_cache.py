"""Cross-isolate bridge for Streamlit's in-memory media files.

Streamlit registers generated media (images, audio, download payloads) in an
in-memory MediaFileManager and serves it over ``/media/*`` HTTP routes. On
Cloudflare, the WebSocket session and the browser's media fetches can land on
*different isolates*, and only the session's isolate holds the bytes — every
other isolate's runtime answers 404. This module mirrors each registered file
into the colo-local Cache API (shared across isolates in a data center) at
registration time, and the entrypoint falls back to the cache when the local
runtime misses.

This bridge exists for the --plain-worker mode only, and it covers media
only: the Cache API is per-colo (a cross-colo fetch can still miss),
eviction is best-effort, and other session-bound state — file uploads, the
session itself on reconnect — has no equivalent bridge (uploads are read
through a synchronous API the async cache cannot back). That is why the
build defaults to the Durable Object deployment (durable.py), where a single
addressable instance makes all of this consistent by construction and the
mirror is simply not installed.
"""

import asyncio
import logging
from typing import Any

_LOGGER = logging.getLogger(__name__)

_CACHE_NAME = "stlite-media"
# Cache API keys are absolute URLs; both the put and match sides use this
# synthetic origin so the key is independent of the request's real host.
_SYNTHETIC_ORIGIN = "https://stlite-media.internal"


def install_media_cache_mirror() -> None:
    """Mirror every media-file registration into the Cache API.

    Patches MemoryMediaFileStorage.load_and_get_id (the single entry point
    through which Streamlit registers media bytes) to schedule a cache write
    after the in-memory registration. Runs in the session's isolate — the
    only place the bytes exist — which is why the mirror must happen at
    registration rather than lazily at first serve.
    """
    from streamlit.runtime.memory_media_file_storage import (
        MemoryMediaFileStorage,
    )

    if getattr(MemoryMediaFileStorage, "_stlite_media_cache_mirror", False):
        return

    original_load_and_get_id = MemoryMediaFileStorage.load_and_get_id

    def load_and_get_id(self: Any, *args: Any, **kwargs: Any) -> str:
        file_id = original_load_and_get_id(self, *args, **kwargs)
        try:
            media_file = self.get_file(file_id)
            url_path = self.get_url(file_id)
            # Fire-and-forget: registration is sync, the cache write is not,
            # and serving correctness only needs the write to land before the
            # browser's fetch (which arrives via a network round trip).
            asyncio.ensure_future(
                _cache_put(url_path, media_file.content, media_file.mimetype)
            )
        except Exception:
            _LOGGER.exception("Failed to mirror media file %s", file_id)
        return file_id

    MemoryMediaFileStorage.load_and_get_id = load_and_get_id  # type: ignore[method-assign]
    MemoryMediaFileStorage._stlite_media_cache_mirror = True  # type: ignore[attr-defined]


async def serve_cached_media(url_path: str) -> Any:
    """The cached JS Response for ``url_path``, or None on miss."""
    import js

    cache = await js.caches.open(_CACHE_NAME)
    cached = await cache.match(f"{_SYNTHETIC_ORIGIN}{url_path}")
    # A miss yields JS undefined, which is falsy through the proxy.
    return cached if cached else None


async def _cache_put(url_path: str, content: bytes, mimetype: str) -> None:
    import js
    from pyodide.ffi import to_js

    try:
        cache = await js.caches.open(_CACHE_NAME)
        response = js.Response.new(
            to_js(content),
            headers=js.Headers.new(
                to_js(
                    [
                        ["content-type", mimetype],
                        # Media is ephemeral (Streamlit drops it when the
                        # session ends); bound the cache copy's lifetime too.
                        ["cache-control", "max-age=3600"],
                    ]
                )
            ),
        )
        await cache.put(f"{_SYNTHETIC_ORIGIN}{url_path}", response)
    except Exception:
        _LOGGER.exception("Failed to cache media file %s", url_path)
