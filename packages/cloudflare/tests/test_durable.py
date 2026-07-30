import pytest

from stlite_cloudflare import durable


class _FakeJsRequest:
    pass


class _FakeRequest:
    def __init__(self):
        self.js_object = _FakeJsRequest()


class _FakeRawStub:
    def __init__(self):
        self.fetched_with = None

    async def fetch(self, request):
        self.fetched_with = request
        return "stub-response"


class _FakeStub:
    """Mimics the SDK's fetcher wrapper: the raw JS stub sits on _binding."""

    def __init__(self):
        self._binding = _FakeRawStub()

    async def fetch(self, request):
        raise AssertionError(
            "the router must bypass the SDK wrapper's fetch (it aborts "
            "proxied WebSockets); use the raw stub instead"
        )


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
    assert stub._binding.fetched_with is request.js_object
    assert namespace.requested_names == [durable._INSTANCE_NAME]


@pytest.mark.asyncio
async def test_all_session_bound_traffic_shares_one_instance():
    """The Durable Object mode's session-consistency mechanism: the WebSocket
    session, the HTTP requests whose state lives in the runtime serving it
    (media, file uploads), and any reconnect all resolve to the same named
    instance, so cross-isolate routing cannot separate a session from its
    state."""
    stub = _FakeStub()
    namespace = _FakeNamespace(stub)
    router = durable.Default(None, _FakeEnv(namespace))

    session_bound_requests = [
        _FakeRequest(),  # GET /_stcore/stream (WebSocket upgrade)
        _FakeRequest(),  # GET /media/<file>
        _FakeRequest(),  # PUT /_stcore/upload_file/<session>/<file>
        _FakeRequest(),  # reconnect: second WebSocket upgrade
    ]
    for request in session_bound_requests:
        await router.fetch(request)

    assert namespace.requested_names == [durable._INSTANCE_NAME] * len(
        session_bound_requests
    )


@pytest.mark.asyncio
async def test_router_reports_a_missing_binding_instead_of_crashing():
    router = durable.Default(None, _FakeEnv())

    response = await router.fetch(_FakeRequest())

    assert response.status == 500


@pytest.mark.asyncio
async def test_durable_object_delegates_to_the_shared_handler(monkeypatch):
    seen = {}

    async def fake_handle_request(env, request, *, mirror_media=True):
        seen["args"] = (env, request, mirror_media)
        return "handled"

    monkeypatch.setattr(durable, "handle_request", fake_handle_request)
    env = _FakeEnv()
    server = durable.StliteServer(None, env)
    request = _FakeRequest()

    assert await server.fetch(request) == "handled"
    # The single-instance deployment has no cross-isolate media gap.
    assert seen["args"] == (env, request, False)
