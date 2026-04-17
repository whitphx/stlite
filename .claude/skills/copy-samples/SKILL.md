---
name: copy-samples
description: Update sharing-editor sample apps from the streamlit/docs repository
disable-model-invocation: true
argument-hint: [path-to-streamlit-docs-repo]
---

Update the sharing-editor sample apps by copying from the upstream Streamlit docs repository.

1. Run the copy-samples script:
   ```shell
   sh packages/sharing-editor/bin/copy-samples.sh $ARGUMENTS
   ```
2. If any patch fails, investigate the upstream changes and update the corresponding patch file in `packages/sharing-editor/bin/sample-diffs/`
3. Verify the build succeeds:
   ```shell
   make sharing-editor
   ```
4. If the build fails due to missing `stlite.json` manifests for new sample directories, create them. Each `stlite.json` needs `title` and `entrypoint` fields. Check existing samples under `packages/sharing-editor/public/samples/` for reference.
5. Check newly added sample files for file paths referencing `python/api-examples-source/` (e.g. `open("python/api-examples-source/cat-purr.mp3", ...)`). These paths don't exist in the sharing-editor samples layout. For each such file:
   - Ensure the referenced asset is copied into `packages/sharing-editor/public/samples/011_component_gallery/pages/` (the copy-samples script or a `cp` command).
   - Create a patch in `packages/sharing-editor/bin/sample-diffs/011_component_gallery/pages/` that rewrites the path to `pages/<filename>`.
   - Add the `cp` and `patch` commands to `copy-samples.sh`.
   - Apply the patch to the current sample file.
     See the existing `charts.audio-purr.py` patch for reference.
