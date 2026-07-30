import asyncio
import sys
import types

import pytest

from stlite_cloudflare import media_cache


class _FakeCache:
    def __init__(self) -> None:
        self.store: dict[str, object] = {}

    async def put(self, url: str, response: object) -> None:
        self.store[url] = response

    async def match(self, url: str):
        # A miss yields JS undefined (falsy); model with None.
        return self.store.get(url)


@pytest.fixture
def fake_js_env(monkeypatch):
    cache = _FakeCache()

    class _FakeResponse:
        def __init__(self, body, headers) -> None:
            self.body = body
            self.headers = headers

    async def open_cache(name: str) -> _FakeCache:
        return cache

    fake_js = types.SimpleNamespace(
        caches=types.SimpleNamespace(open=open_cache),
        Response=types.SimpleNamespace(
            new=lambda body, headers: _FakeResponse(body, headers)
        ),
        Headers=types.SimpleNamespace(new=lambda pairs: pairs),
    )
    fake_pyodide = types.ModuleType("pyodide")
    fake_ffi = types.ModuleType("pyodide.ffi")
    fake_ffi.to_js = lambda value: value
    fake_pyodide.ffi = fake_ffi

    monkeypatch.setitem(sys.modules, "js", fake_js)
    monkeypatch.setitem(sys.modules, "pyodide", fake_pyodide)
    monkeypatch.setitem(sys.modules, "pyodide.ffi", fake_ffi)
    return cache


class _MemoryFile:
    def __init__(self, content: bytes, mimetype: str) -> None:
        self.content = content
        self.mimetype = mimetype


class _FakeStorage:
    def load_and_get_id(self, data, mimetype, kind, filename=None):
        self._file = _MemoryFile(data, mimetype)
        return "abc123"

    def get_file(self, file_id):
        return self._file

    def get_url(self, file_id):
        return f"/media/{file_id}.gif"


@pytest.fixture
def fake_storage_module(monkeypatch):
    module = types.ModuleType("streamlit.runtime.memory_media_file_storage")
    module.MemoryMediaFileStorage = _FakeStorage
    streamlit = types.ModuleType("streamlit")
    runtime = types.ModuleType("streamlit.runtime")
    monkeypatch.setitem(sys.modules, "streamlit", streamlit)
    monkeypatch.setitem(sys.modules, "streamlit.runtime", runtime)
    monkeypatch.setitem(
        sys.modules, "streamlit.runtime.memory_media_file_storage", module
    )
    return module


@pytest.mark.asyncio
async def test_mirror_writes_registration_to_the_cache(
    fake_js_env, fake_storage_module
):
    media_cache.install_media_cache_mirror()
    # Idempotent: a second install must not double-wrap.
    media_cache.install_media_cache_mirror()

    storage = fake_storage_module.MemoryMediaFileStorage()
    file_id = storage.load_and_get_id(b"GIF89a...", "image/gif", kind=None)
    assert file_id == "abc123"
    # Let the fire-and-forget cache write land.
    for _ in range(5):
        await asyncio.sleep(0)

    key = f"{media_cache._SYNTHETIC_ORIGIN}/media/abc123.gif"
    assert key in fake_js_env.store
    cached = fake_js_env.store[key]
    assert cached.body == b"GIF89a..."

    # And the serving side finds it by path.
    assert await media_cache.serve_cached_media("/media/abc123.gif") is cached


@pytest.mark.asyncio
async def test_serve_cached_media_misses_cleanly(fake_js_env):
    assert await media_cache.serve_cached_media("/media/nope.gif") is None


@pytest.mark.asyncio
async def test_media_bridges_between_isolates_in_plain_worker_mode(
    fake_js_env, fake_storage_module, monkeypatch
):
    """--plain-worker cross-isolate simulation: the session's isolate registers
    a media file, and a different isolate — whose own runtime has never seen
    the file and answers 404 — serves it from the shared colo cache."""
    # Isolate A: the session's runtime registers media (mirror installed).
    media_cache.install_media_cache_mirror()
    storage = fake_storage_module.MemoryMediaFileStorage()
    storage.load_and_get_id(b"frame-bytes", "image/png", kind=None)
    for _ in range(5):
        await asyncio.sleep(0)

    # Isolate B: fresh module state (no mirror installed, no in-memory file),
    # sharing only the colo-local cache.
    monkeypatch.setattr(media_cache, "_installed", False, raising=False)
    served = await media_cache.serve_cached_media("/media/abc123.gif")
    assert served is not None
    assert served.body == b"frame-bytes"
