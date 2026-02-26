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
