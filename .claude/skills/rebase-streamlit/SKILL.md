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

    **Alignment policy: follow upstream as long as it works.** The dep alignment
    is best-effort, not strict. Most of stlite's packages have their own build
    pipelines and don't share a module graph with upstream, so build-tool bumps
    in particular are landing into different blast radii than upstream's CI saw.
    Past rebases hit three regressions because of blanket alignment:
    - **TypeScript 5→6**: stricter narrowing surfaces type errors in upstream
      frontend code that upstream's CI doesn't catch (their build is vite-only,
      no tsc gate). Symptom: `make kernel` exits non-zero from
      `packages/react`'s `tsc --noEmit && vite build`.
    - **Yarn 4.5.3→4.13.0**: streamlit's `.yarnrc.yml` introduces newer
      settings (e.g. `npmMinimalAgeGate`) that older Yarn rejects. Symptom:
      `make kernel` fails before any TS compiles, on workspace install.
    - **Vite 7→8**: Rolldown handles CJS deps differently from Rollup +
      `@rollup/plugin-commonjs`, breaking `@stlite/react`'s bundle in the
      browser even though `make browser` exits clean. Symptom: page-load
      `Calling \`require\` for "react" in an environment that doesn't expose
      the \`require\` function`. Only surfaces in a real browser, not in CI.

    Rule of thumb: build-tool deps (`vite`, `vitest`, `typescript`, the
    various `vite-plugin-*`, and the `packageManager` Yarn pin) should match
    upstream only if the build chain stays green and a manual `yarn start`
    in `packages/browser` (loaded in a real browser) shows no console errors.
    Otherwise, leave them at their current versions in `packages/*` and
    leave a top-level `"//"` comment in the affected `package.json` noting
    the pin and the follow-up condition for retrying the bump
    (see `packages/react/package.json` for an example).

    Runtime/type-shared deps still align unconditionally — anything imported
    across the package boundary (e.g. `protobufjs` because we consume
    `@streamlit/protobuf`, `@types/react`, `@emotion/*`).

13. Verify the rebase produces a working browser bundle, not just clean
    builds. CI's `make browser` only compiles — it doesn't execute. After
    the dep alignment in step 12 (especially after any vite, plugin-react,
    or @emotion bump), run:

    ```shell
    yarn workspace @stlite/browser start
    ```

    Then load `http://localhost:3001/demos/basic-mount/` in a real browser
    (or via Playwright MCP) and confirm:
    - Zero console errors after the demo finishes loading
    - The Streamlit script actually renders (e.g. `st.write("Hello")` shows)

    If errors surface, narrow the dep bump that caused it and either pin
    that one dep back or update the alignment skip-list above.
