---
name: streamlit-rebase
description: Rebase our custom fork of the Streamlit repository onto new upstream Streamlit release
disable-model-invocation: true
argument-hint: [new-version]
---

Rebase the stlite customization branch onto a new upstream Streamlit release.

1. Navigate to the `/streamlit` submodule directory
2. Fetch the latest tags from upstream:
   ```shell
   git fetch upstream --tags
   ```
3. Infer the current base branch such as `stlite-1.44.0-4`.
   Our project naming convention is `stlite-[upstream-version](-[customization-version])?`.
   Use this to determine the previous upstream version tag,
   and ask me to confirm it before proceeding.
   The base Streamlit version tag can be inferred from the current branch name as well.
   ```shell
   CURRENT_STLITE_BRANCH="INFERRED_BRANCH_NAME_HERE"
   CURRENT_BASE_STREAMLIT_VERSION_TAG="INFERRED_TAG_NAME_HERE"
   ```
4. Assume `NEW_BASE_STREAMLIT_VERSION_TAG` is the tag name of the new upstream release, e.g., `1.45.0`.
   ```shell
   NEW_BASE_STREAMLIT_VERSION_TAG=$ARGUMENTS
   ```
5. Determine the new stlite customized branch name, e.g., `stlite-1.45.0`.
   ```shell
   NEW_STLITE_BRANCH=stlite-$ARGUMENTS
   ```
6. Create the new stlite customization branch from the current one:
   ```shell
   git checkout -b $NEW_STLITE_BRANCH $CURRENT_STLITE_BRANCH
   ```
7. Rebase onto the new upstream tag:
   ```shell
   git rebase --onto $NEW_BASE_STREAMLIT_VERSION_TAG $CURRENT_BASE_STREAMLIT_VERSION_TAG $NEW_STLITE_BRANCH
   ```
8. If conflicts occur:
   - Run `git status` to identify conflicting files
   - Read each conflicting file to understand both versions
   - Resolve conflicts by preserving stlite customizations while incorporating upstream changes
     - If the conflict is so large, ask the developer for review and help
   - Run `git add` on resolved files
   - Continue with `git rebase --continue`
9. Repeat until rebase completes
10. Verify with `git log --oneline` that customization commits are on top of the new tag
