import io
import sys
import tarfile
from pathlib import Path

import pytest

from stlite_cloudflare import package_loader


class _FakeResponse:
    def __init__(self, status: int, body: bytes) -> None:
        self.status = status
        self._body = body

    async def bytes(self) -> bytes:
        return self._body


class _FakeAssets:
    def __init__(self, status: int, body: bytes) -> None:
        self._response = _FakeResponse(status, body)
        self.fetched: list[str] = []

    async def fetch(self, url: str) -> _FakeResponse:
        self.fetched.append(url)
        return self._response


class _FakeEnv:
    def __init__(self, assets: _FakeAssets | None) -> None:
        if assets is not None:
            self.ASSETS = assets


def _make_archive(compress: bool) -> bytes:
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode="w:gz" if compress else "w") as tar:
        payload = b"VALUE = 1\n"
        info = tarfile.TarInfo("packedmod.py")
        info.size = len(payload)
        tar.addfile(info, io.BytesIO(payload))
    return buffer.getvalue()


@pytest.fixture(autouse=True)
def isolated_loader(monkeypatch, tmp_path):
    target = tmp_path / "extracted"
    monkeypatch.setattr(package_loader, "_TARGET", target)
    monkeypatch.setattr(package_loader, "_installed", False)
    original_path = list(sys.path)
    yield target
    sys.path[:] = original_path


@pytest.mark.asyncio
@pytest.mark.parametrize("compressed", [True, False])
async def test_ensure_packages_extracts_and_activates(
    isolated_loader: Path, compressed: bool
):
    # The assets layer may serve the .gz either raw or transparently decoded;
    # both must extract.
    assets = _FakeAssets(200, _make_archive(compress=compressed))

    await package_loader.ensure_packages(_FakeEnv(assets))

    assert (isolated_loader / "packedmod.py").read_text() == "VALUE = 1\n"
    assert str(isolated_loader) in sys.path
    assert assets.fetched == [
        f"https://assets.internal{package_loader.PACKAGES_ASSET_PATH}"
    ]

    # A second call is a no-op (no second fetch).
    await package_loader.ensure_packages(_FakeEnv(assets))
    assert len(assets.fetched) == 1


@pytest.mark.asyncio
async def test_ensure_packages_requires_the_assets_binding(isolated_loader):
    with pytest.raises(RuntimeError, match="ASSETS binding is missing"):
        await package_loader.ensure_packages(_FakeEnv(None))


@pytest.mark.asyncio
async def test_ensure_packages_surfaces_fetch_failures(isolated_loader):
    assets = _FakeAssets(404, b"")
    with pytest.raises(RuntimeError, match="HTTP 404"):
        await package_loader.ensure_packages(_FakeEnv(assets))
