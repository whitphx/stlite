import io
import sys
import tarfile
import zipfile
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
    def __init__(self, responses: dict[str, _FakeResponse]) -> None:
        self._responses = responses
        self.fetched: list[str] = []

    async def fetch(self, url: str) -> _FakeResponse:
        self.fetched.append(url)
        asset_path = url.removeprefix("https://assets.internal")
        return self._responses.get(asset_path, _FakeResponse(404, b""))


class _FakeEnv:
    def __init__(self, assets: _FakeAssets | None) -> None:
        if assets is not None:
            self.ASSETS = assets


def _make_zip() -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("packedmod.py", "VALUE = 1\n")
    return buffer.getvalue()


def _make_app_tar(compress: bool) -> bytes:
    buffer = io.BytesIO()
    with tarfile.open(fileobj=buffer, mode="w:gz" if compress else "w") as tar:
        payload = b"APP = True\n"
        info = tarfile.TarInfo("_stlite_cloudflare_app/streamlit_app.py")
        info.size = len(payload)
        tar.addfile(info, io.BytesIO(payload))
    return buffer.getvalue()


def _fake_assets(compress_app: bool = True) -> _FakeAssets:
    return _FakeAssets(
        {
            package_loader.PACKAGES_ZIP_ASSET_PATH: _FakeResponse(200, _make_zip()),
            package_loader.EXTRACTED_ARCHIVE_ASSET_PATH: _FakeResponse(
                200, _make_app_tar(compress=compress_app)
            ),
        }
    )


@pytest.fixture(autouse=True)
def isolated_loader(monkeypatch, tmp_path):
    monkeypatch.setattr(package_loader, "_ZIP_TARGET", tmp_path / "python-modules.zip")
    monkeypatch.setattr(package_loader, "_EXTRACT_TARGET", tmp_path / "extracted")
    monkeypatch.setattr(package_loader, "_installed", False)
    original_path = list(sys.path)
    yield tmp_path
    sys.path[:] = original_path
    sys.modules.pop("packedmod", None)


@pytest.mark.asyncio
@pytest.mark.parametrize("compress_app", [True, False])
async def test_ensure_packages_activates_zip_and_extracts_app(
    isolated_loader: Path, compress_app: bool
):
    assets = _fake_assets(compress_app=compress_app)

    await package_loader.ensure_packages(_FakeEnv(assets))

    # The libraries import straight from the zip via zipimport…
    import packedmod

    assert packedmod.VALUE == 1
    assert "python-modules.zip" in packedmod.__file__
    # …while the app package lands as real files.
    app_script = (
        isolated_loader / "extracted" / "_stlite_cloudflare_app" / "streamlit_app.py"
    )
    assert app_script.read_text() == "APP = True\n"

    # A second call is a no-op (no further fetches).
    fetch_count = len(assets.fetched)
    await package_loader.ensure_packages(_FakeEnv(assets))
    assert len(assets.fetched) == fetch_count


@pytest.mark.asyncio
async def test_ensure_packages_requires_the_assets_binding(isolated_loader):
    with pytest.raises(RuntimeError, match="ASSETS binding is missing"):
        await package_loader.ensure_packages(_FakeEnv(None))


@pytest.mark.asyncio
async def test_ensure_packages_surfaces_fetch_failures(isolated_loader):
    assets = _FakeAssets({})
    with pytest.raises(RuntimeError, match="HTTP 404"):
        await package_loader.ensure_packages(_FakeEnv(assets))
