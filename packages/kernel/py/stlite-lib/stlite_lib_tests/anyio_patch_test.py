import threading

import anyio
import anyio.to_thread
from anyio._backends._asyncio import AsyncIOBackend

from stlite_lib import anyio_patch


async def offload_thread_ids():
    return threading.get_ident(), await anyio.to_thread.run_sync(threading.get_ident)


def test_install_runs_to_thread_offloads_on_the_calling_thread(monkeypatch):
    # Restores the original descriptor on teardown; install() overwrites it.
    monkeypatch.setattr(
        AsyncIOBackend,
        "run_sync_in_worker_thread",
        AsyncIOBackend.__dict__["run_sync_in_worker_thread"],
    )
    caller, worker = anyio.run(offload_thread_ids)
    assert worker != caller

    anyio_patch.install()

    caller, worker = anyio.run(offload_thread_ids)
    assert worker == caller
