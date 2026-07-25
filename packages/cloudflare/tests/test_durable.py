import pytest

from stlite_cloudflare import durable


class _FakeJsRequest:
    pass


class _FakeRequest:
    def __init__(self):
        self.js_object = _FakeJsRequest()


class _FakeStub:
    def __init__(self):
        self.fetched_with = None

    async def fetch(self, request):
        self.fetched_with = request
        return "stub-response"


class _FakeNamespace:
    def __init__(self, stub):
        self._stub = stub
        self.requested_names = []

    def getByName(self, name):
        self.requested_names.append(name)
        return self._stub


class _FakeEnv:
    def __init__(self, namespace=None):
        if namespace is not None:
            self.STLITE_SERVER = namespace


@pytest.mark.asyncio
async def test_router_forwards_the_raw_js_request_to_one_named_instance():
    stub = _FakeStub()
    namespace = _FakeNamespace(stub)
    router = durable.Default(None, _FakeEnv(namespace))
    request = _FakeRequest()

    response = await router.fetch(request)

    assert response == "stub-response"
    assert stub.fetched_with is request.js_object
    assert namespace.requested_names == [durable._INSTANCE_NAME]


@pytest.mark.asyncio
async def test_router_reports_a_missing_binding_instead_of_crashing():
    router = durable.Default(None, _FakeEnv())

    response = await router.fetch(_FakeRequest())

    assert response.status == 500


@pytest.mark.asyncio
async def test_durable_object_delegates_to_the_shared_handler(monkeypatch):
    seen = {}

    async def fake_handle_request(env, request):
        seen["args"] = (env, request)
        return "handled"

    monkeypatch.setattr(durable, "handle_request", fake_handle_request)
    env = _FakeEnv()
    server = durable.StliteServer(None, env)
    request = _FakeRequest()

    assert await server.fetch(request) == "handled"
    assert seen["args"] == (env, request)
