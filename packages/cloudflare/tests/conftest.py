import sys
import types

# The `workers` SDK exists only inside the Workers runtime (it is vendored into
# the deployed script), so modules that import it at the top level
# (entry.py, durable.py) need this stand-in to be importable under pytest.
if "workers" not in sys.modules:
    module = types.ModuleType("workers")

    class _Entrypoint:
        def __init__(self, ctx, env):
            self.ctx = ctx
            self.env = env

    class _Response:
        def __init__(self, body, status=200, headers=None):
            self.body = body
            self.status = status
            self.headers = headers or {}

    module.DurableObject = type("DurableObject", (_Entrypoint,), {})
    module.WorkerEntrypoint = type("WorkerEntrypoint", (_Entrypoint,), {})
    module.Response = _Response
    module.wait_until = lambda task_proxy: None
    sys.modules["workers"] = module
