#!/bin/bash
# Updates Playwright snapshots in a Linux Docker container.
# This ensures snapshots match CI (which runs on Linux).

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/run-in-docker.sh" --update-snapshots

echo "Done! Linux snapshots have been updated."
