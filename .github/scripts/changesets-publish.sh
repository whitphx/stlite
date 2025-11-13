#!/usr/bin/env bash
set -Eeuo pipefail

# Configure git identity for tagging pushes
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

echo "Creating per-package tags via Changesets..."
yarn changeset tag

# Compute a global version tag based on @stlite/browser (fixed mode keeps versions aligned)
VERSION=$(node -p "require('./packages/browser/package.json').version")
GLOBAL_TAG="v${VERSION}"

echo "Creating global tag ${GLOBAL_TAG}..."
if git rev-parse -q --verify "refs/tags/${GLOBAL_TAG}" >/dev/null; then
  echo "Tag ${GLOBAL_TAG} already exists locally; re-pointing to HEAD"
  git tag -f "${GLOBAL_TAG}"
else
  git tag "${GLOBAL_TAG}"
fi

echo "Pushing tags to origin..."
git push --follow-tags origin "${GLOBAL_TAG}"

echo "Done. Tags pushed; downstream tag-triggered workflows will publish."

