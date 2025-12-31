import asyncio
import os
import tempfile

import pytest

from stlite_lib.server.task_context import (
    DirectorySyncCoroutineProxy,
    home_dir_contextvar,
)


@pytest.mark.asyncio
async def test_home_dir_sync_coroutine_proxy():
    # Create a temporary directory to use as the task-specific home directory
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir = os.path.realpath(temp_dir)
        original_cwd = os.getcwd()
        original_home = os.environ.get("HOME")

        # Define an async function that will be wrapped
        async def my_coroutine():
            # Check if CWD is set to the task-specific dir
            assert os.path.realpath(os.getcwd()) == temp_dir
            # Check if HOME is set to the task-specific dir
            assert os.path.realpath(os.environ["HOME"]) == temp_dir

            # Yield control to simulate async operations
            await asyncio.sleep(0.01)

            # Check again after resuming
            assert os.path.realpath(os.getcwd()) == temp_dir
            assert os.path.realpath(os.environ["HOME"]) == temp_dir

            return "done"

        # Set the context var
        token = home_dir_contextvar.set(temp_dir)
        try:
            coro = my_coroutine()
            proxy = DirectorySyncCoroutineProxy(coro)

            # During execution of the proxy, the CWD inside my_coroutine should be temp_dir.
            # But here in the test function (outside the proxy), it should be original_cwd
            # EXCEPT that we are running in the same thread, so relying on "outside" check
            # while proxy is NOT running is what we can do.

            assert os.path.realpath(os.getcwd()) == os.path.realpath(original_cwd)

            result = await proxy
            assert result == "done"

            # After execution, CWD should be restored
            assert os.path.realpath(os.getcwd()) == os.path.realpath(original_cwd)
            if original_home is not None:
                assert os.environ["HOME"] == original_home

        finally:
            home_dir_contextvar.reset(token)


@pytest.mark.asyncio
async def test_home_dir_switching():
    """Test that switching between two tasks with different home dirs works correctly."""
    with tempfile.TemporaryDirectory() as dir1, tempfile.TemporaryDirectory() as dir2:
        dir1 = os.path.realpath(dir1)
        dir2 = os.path.realpath(dir2)

        async def task_func(expected_dir, event_wait, event_set):
            assert os.path.realpath(os.getcwd()) == expected_dir
            event_set.set()
            await event_wait.wait()
            assert os.path.realpath(os.getcwd()) == expected_dir
            return expected_dir

        event1 = asyncio.Event()
        event2 = asyncio.Event()

        # Task 1 setup
        token1 = home_dir_contextvar.set(dir1)
        coro1 = task_func(dir1, event1, event2)
        proxy1 = DirectorySyncCoroutineProxy(coro1)
        # Create task while token1 is active so context is copied
        task1 = asyncio.create_task(proxy1)
        home_dir_contextvar.reset(token1)

        # Task 2 setup
        token2 = home_dir_contextvar.set(dir2)
        coro2 = task_func(dir2, event2, event1)
        proxy2 = DirectorySyncCoroutineProxy(coro2)
        task2 = asyncio.create_task(proxy2)
        home_dir_contextvar.reset(token2)

        await asyncio.gather(task1, task2)


@pytest.mark.asyncio
async def test_dir_sync_coroutine_proxy_persistence():
    """Test that CWD/HOME changes persist and are isolated between tasks."""
    with tempfile.TemporaryDirectory() as base_dir:
        base_dir = os.path.realpath(base_dir)

        # Prepare two separate environments
        dir1 = os.path.join(base_dir, "dir1")
        subdir1 = os.path.join(dir1, "subdir")
        os.makedirs(subdir1)
        dir1 = os.path.realpath(dir1)
        subdir1 = os.path.realpath(subdir1)

        dir2 = os.path.join(base_dir, "dir2")
        subdir2 = os.path.join(dir2, "subdir")
        os.makedirs(subdir2)
        dir2 = os.path.realpath(dir2)
        subdir2 = os.path.realpath(subdir2)

        async def task_func(initial_dir, switch_to_dir, event_wait, event_set):
            # Initial state verification
            assert os.path.realpath(os.getcwd()) == initial_dir
            assert os.path.realpath(os.environ["HOME"]) == initial_dir

            # Switch directory and HOME
            os.chdir(switch_to_dir)
            os.environ["HOME"] = switch_to_dir

            # Signal we've switched
            event_set.set()

            # Wait for other task to switch too
            await event_wait.wait()

            # Verify our switch persisted and wasn't clobbered by the other task
            assert os.path.realpath(os.getcwd()) == switch_to_dir
            assert os.path.realpath(os.environ["HOME"]) == switch_to_dir

            return "done"

        event1 = asyncio.Event()
        event2 = asyncio.Event()

        # Task 1 setup
        token1 = home_dir_contextvar.set(dir1)
        coro1 = task_func(dir1, subdir1, event1, event2)
        proxy1 = DirectorySyncCoroutineProxy(coro1)
        task1 = asyncio.create_task(proxy1)
        home_dir_contextvar.reset(token1)

        # Task 2 setup
        token2 = home_dir_contextvar.set(dir2)
        coro2 = task_func(dir2, subdir2, event2, event1)
        proxy2 = DirectorySyncCoroutineProxy(coro2)
        task2 = asyncio.create_task(proxy2)
        home_dir_contextvar.reset(token2)

        await asyncio.gather(task1, task2)
