---
name: changeset
description: Create or update a changeset fragment (.changeset/*.md) reflecting the changes made in the current session or branch. Use this skill whenever the user asks to add a changeset, create a changeset, update a changeset, or says something like "add changeset", "changeset", or "version bump". Also use it proactively when you notice user-facing changes have been made but no changeset exists yet.
---

Create or update a `.changeset/<name>.md` file that describes the changes made in the current session or branch, following the [changesets](https://github.com/changesets/changesets) convention.

## Changeset file format

```markdown
---
"@stlite/kernel": minor
"@stlite/browser": minor
---

Short description of the change
```

- YAML frontmatter lists each affected package with its semver bump type (`patch`, `minor`, or `major`).
- Body is a concise description (1-2 sentences) of what changed and why.
- Filename should be descriptive and kebab-cased (e.g., `update-streamlit-1-53-1.md`, `fix-idbfs-worker.md`).

## Step-by-step process

### 1. Gather context about the changes

Use these sources in priority order:

1. **Conversation history** — Review what was done in this session. This is the richest source because it captures intent, not just diffs.
2. **Git diff against the base branch** — Run `git diff --stat main...HEAD` and `git log main..HEAD --oneline` to see all changes introduced on the current branch.
3. **Ask the user** — If the above sources don't give enough information to determine affected packages or bump type, ask.

### 2. Check for existing changesets on this branch

```bash
# Check committed, staged, modified, and untracked changeset files
git diff --name-only main...HEAD -- '.changeset/*.md'
git diff --name-only --cached -- '.changeset/*.md'
git diff --name-only -- '.changeset/*.md'
git ls-files --others --exclude-standard -- '.changeset/*.md'
```

If a changeset already exists for this branch (committed, staged, modified, or untracked), read it and decide whether to **update** it (if the scope of changes has grown) or leave it alone. Don't create duplicates.

### 3. Determine affected packages

Each subdirectory under `packages/` is a package. To list all packages and their names:

```bash
for dir in packages/*/; do
  node -e "console.log(require('./$dir/package.json').name + ' -> ' + '$dir')"
done
```

Use the git diff output to identify which `packages/*/` directories have changes, then look up the package name from the corresponding `package.json`.

Changes to the `streamlit/` submodule affect different `@stlite/*` packages depending on what changed:

- `streamlit/lib/` (Python code) → `@stlite/kernel` (builds the Streamlit wheel)
- `streamlit/frontend/` (TypeScript/React code) → `@stlite/kernel` and `@stlite/react` (which consume `@streamlit/connection` and `@streamlit/app` respectively)

Note: `@streamlit/*` packages (under `streamlit/frontend/`) are not released — they are source packages consumed by `@stlite/*` packages. Only `@stlite/*` packages should appear in changesets.

#### DevDependency consumers must be listed explicitly

Changesets does not automatically bump packages that consume a changed package via `devDependencies` (see https://github.com/changesets/changesets/pull/1159). Because of this, when a package is changed, its **devDependency consumers** must also be listed in the changeset explicitly.

To find the devDependency consumer graph, run this command from the repo root. It scans both `packages/` and `streamlit/frontend/` workspaces, and traces indirect paths where `@stlite/*` packages are connected through `@streamlit/*` intermediaries:

```bash
node <<'EOF'
const fs = require('fs');
const path = require('path');

// Collect all workspace packages
const workspaces = [];
for (const base of ['packages', 'streamlit/frontend']) {
  if (!fs.existsSync(base)) continue;
  for (const dir of fs.readdirSync(base)) {
    const pkgPath = path.join(base, dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      workspaces.push(JSON.parse(fs.readFileSync(pkgPath, 'utf8')));
    }
  }
}

// Build devDependency edges: dep -> [consumers]
const devDepGraph = {};
for (const pkg of workspaces) {
  for (const dep of Object.keys(pkg.devDependencies || {})) {
    if (dep.startsWith('@stlite/') || dep.startsWith('@streamlit/')) {
      (devDepGraph[dep] ??= []).push(pkg.name);
    }
  }
}

// Build regular dependency edges too (for traversal through @streamlit/*)
const depGraph = {};
for (const pkg of workspaces) {
  for (const dep of Object.keys(pkg.dependencies || {})) {
    if (dep.startsWith('@stlite/') || dep.startsWith('@streamlit/')) {
      (depGraph[dep] ??= []).push(pkg.name);
    }
  }
}

// For each @stlite/* package, find all @stlite/* packages that transitively
// devDepend on it (possibly through @streamlit/* intermediaries)
const stlitePackages = workspaces.filter(p => p.name.startsWith('@stlite/')).map(p => p.name);
for (const pkg of stlitePackages) {
  const consumers = new Set();
  const queue = [pkg];
  const visited = new Set();
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    // Find packages that devDepend on current
    for (const consumer of (devDepGraph[current] || [])) {
      if (consumer.startsWith('@stlite/')) consumers.add(consumer);
      queue.push(consumer);
    }
    // Also follow regular dep edges from @streamlit/* packages
    // (e.g., @streamlit/app depends on @stlite/kernel, so if kernel changes,
    // anything that devDepends on @streamlit/app is also affected)
    for (const consumer of (depGraph[current] || [])) {
      if (consumer.startsWith('@streamlit/')) queue.push(consumer);
    }
  }
  if (consumers.size > 0) {
    console.log(pkg + ' -> devDep consumers: ' + [...consumers].sort().join(', '));
  }
}
EOF
```

Use this output to determine which additional `@stlite/*` packages must be listed in the changeset. All devDependency consumers (including those connected indirectly through `@streamlit/*` packages) should get the same bump type as the source package.

You do NOT need to list packages connected only via regular `dependencies` — changesets handles those automatically.

### 4. Determine the bump type

Infer the semver bump from the nature of the changes:

- **`patch`** — Bug fixes, internal refactors with no API changes, dependency updates that don't change behavior
- **`minor`** — New features, new APIs, updating upstream Streamlit version, non-breaking enhancements
- **`major`** — Breaking changes to public APIs, removing features, changes that require users to modify their code

When in doubt, prefer `minor` for new capabilities and `patch` for fixes.

### 5. Write the changeset file

- Place it in `.changeset/` at the repo root.
- Use a descriptive kebab-case filename (e.g., `update-streamlit-1-53-1.md`, `fix-kernel-connection-error.md`).
- Keep the description concise — focus on what changed from the user's perspective, not implementation details.
- All devDependency consumers of affected packages should get the same bump type as the source package.

### 6. Validate the changeset

After writing the file, run:

```shell
yarn changeset status --since main
```

This confirms that the changeset is well-formed and lists the expected version bumps. If the output looks wrong, fix the file before proceeding.

### 7. Confirm with the user

Show the user the changeset content and the validation output. If any judgment calls were ambiguous (e.g., patch vs minor), explain your reasoning.
