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
11. Self double-check the rebase with two diff comparisons. Both should match except for trivially explainable differences (e.g., files the stlite customization deletes, conflict-resolution overhead in files you manually merged):

    a. The diff between `$CURRENT_STLITE_BRANCH` and `$NEW_STLITE_BRANCH` should match the diff between `$CURRENT_BASE_STREAMLIT_VERSION_TAG` and `$NEW_BASE_STREAMLIT_VERSION_TAG` (upstream delta preserved):

    ```shell
    git diff $CURRENT_STLITE_BRANCH..$NEW_STLITE_BRANCH --stat > /tmp/stlite-delta.txt
    git diff $CURRENT_BASE_STREAMLIT_VERSION_TAG..$NEW_BASE_STREAMLIT_VERSION_TAG --stat > /tmp/upstream-delta.txt
    diff /tmp/stlite-delta.txt /tmp/upstream-delta.txt
    ```

    b. The diff between `$NEW_BASE_STREAMLIT_VERSION_TAG` and `$NEW_STLITE_BRANCH` should match the diff between `$CURRENT_BASE_STREAMLIT_VERSION_TAG` and `$CURRENT_STLITE_BRANCH` (customization delta preserved). In particular, the set of customized files should be identical:

    ```shell
    git diff $NEW_BASE_STREAMLIT_VERSION_TAG..$NEW_STLITE_BRANCH --name-only | sort > /tmp/files-new.txt
    git diff $CURRENT_BASE_STREAMLIT_VERSION_TAG..$CURRENT_STLITE_BRANCH --name-only | sort > /tmp/files-old.txt
    diff /tmp/files-old.txt /tmp/files-new.txt  # should be empty
    ```

    Summarize any differences (what file, how many lines, and why it's expected) and show the summary to the user so they can confirm the rebase is clean.

12. After the rebase, update shared dependency versions in `packages/*/package.json` to match `streamlit/frontend/*/package.json`.
    For each dependency that appears in both a `packages/*/package.json` and a `streamlit/frontend/*/package.json`,
    if the version in `streamlit/frontend/*/package.json` is newer, update the version in `packages/*/package.json` to match.
    Note: `@vitejs/plugin-react` in `packages/*` and `@vitejs/plugin-react-swc` in `streamlit/frontend/*` are different packages — do not align them.
    After updating, run `yarn install` to regenerate the lockfile.
