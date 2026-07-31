import sys
import types

import pytest

from stlite_cloudflare import worker_env


class _FakeEnv:
    def __init__(self, **entries):
        for key, value in entries.items():
            setattr(self, key, value)


@pytest.fixture
def fake_cloudflare_env(monkeypatch):
    env = _FakeEnv(
        APP_MESSAGE="hello",
        API_KEY="hunter2",
        ASSETS=object(),
        STLITE_SERVER=object(),
    )

    def import_from_javascript(name):
        assert name == "cloudflare:workers"
        return types.SimpleNamespace(env=env)

    monkeypatch.setattr(
        sys.modules["workers"],
        "import_from_javascript",
        import_from_javascript,
        raising=False,
    )
    fake_js = types.SimpleNamespace(
        Object=types.SimpleNamespace(keys=lambda obj: list(vars(obj)))
    )
    monkeypatch.setitem(sys.modules, "js", fake_js)
    return env


class _RecordingSecrets:
    def __init__(self):
        self.merged = None

    def merge_programmatic_secrets(self, values):
        self.merged = dict(values)


@pytest.fixture
def fake_secrets_singleton(monkeypatch):
    singleton = _RecordingSecrets()
    module = types.ModuleType("streamlit.runtime.secrets")
    module.secrets_singleton = singleton
    streamlit = types.ModuleType("streamlit")
    runtime = types.ModuleType("streamlit.runtime")
    monkeypatch.setitem(sys.modules, "streamlit", streamlit)
    monkeypatch.setitem(sys.modules, "streamlit.runtime", runtime)
    monkeypatch.setitem(sys.modules, "streamlit.runtime.secrets", module)
    return singleton


def test_get_env_returns_the_worker_environment(fake_cloudflare_env):
    assert worker_env.get_env() is fake_cloudflare_env


def test_install_worker_secrets_merges_only_string_values(
    fake_cloudflare_env, fake_secrets_singleton
):
    worker_env.install_worker_secrets()

    # vars and encrypted secrets are strings; object bindings are skipped.
    assert fake_secrets_singleton.merged == {
        "APP_MESSAGE": "hello",
        "API_KEY": "hunter2",
    }


def test_install_worker_secrets_skips_merge_without_string_values(
    monkeypatch, fake_cloudflare_env, fake_secrets_singleton
):
    for key in ("APP_MESSAGE", "API_KEY"):
        delattr(fake_cloudflare_env, key)

    worker_env.install_worker_secrets()

    assert fake_secrets_singleton.merged is None
