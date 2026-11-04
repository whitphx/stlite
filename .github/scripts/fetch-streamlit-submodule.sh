#!/usr/bin/env bash
#
# Check out the `streamlit` submodule at the commit the superproject pins,
# much faster than `actions/checkout`'s `submodules: true`.
#
# - It fetches only the pinned commit, with no history (`--depth=1`). The
#   `git submodule update --depth=1` that `actions/checkout` runs first clones
#   the fork's default branch and then fetches the pinned commit on top, and
#   it took 60-120s per job in CI.
# - It is a partial clone (`--filter=blob:none`) with a sparse checkout that
#   leaves out `e2e_playwright/__snapshots__/`: about 100 MB of upstream
#   Playwright screenshots, which nothing in this repository's CI reads. The
#   blobs of every other path are fetched by the checkout, in one request.
# - It ignores `fetch-depth: 0` on the superproject's checkout, which
#   `actions/checkout` also applies to submodules: the Changesets job needs
#   this repository's full history for its tags, but not the fork's.
#
# Run it from the superproject's root after `actions/checkout` (without
# `submodules:`). It leaves the submodule registered and absorbed the way
# `git submodule update --init` does, so later `git submodule` commands work.

set -euo pipefail

path=streamlit
sha=$(git rev-parse "HEAD:$path")
url=$(git config --file .gitmodules "submodule.$path.url")

git submodule init "$path"

rm -rf "$path"
mkdir -p "$path"
git -C "$path" init --quiet
git -C "$path" remote add origin "$url"
git -C "$path" config core.sparseCheckout true
git -C "$path" sparse-checkout set --no-cone '/*' '!/e2e_playwright/__snapshots__/'

for attempt in 1 2 3 4; do
  if git -C "$path" -c protocol.version=2 fetch --quiet --no-tags --depth=1 \
    --filter=blob:none origin "$sha"; then
    break
  fi
  if [ "$attempt" = 4 ]; then
    echo "Failed to fetch $url $sha" >&2
    exit 1
  fi
  sleep $((attempt * 2))
done

git -C "$path" -c advice.detachedHead=false checkout --quiet "$sha"
git submodule absorbgitdirs "$path"

git submodule status "$path"
