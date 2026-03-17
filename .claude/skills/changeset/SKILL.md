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
2. **Git diff against the base branch** — Run `git diff main --stat` and `git log main..HEAD --oneline` to see all changes on the current branch.
3. **Ask the user** — If the above sources don't give enough information to determine affected packages or bump type, ask.

### 2. Check for existing changesets on this branch

```shell
git diff main --name-only -- '.changeset/*.md'
```

If a changeset already exists for this branch, read it and decide whether to **update** it (if the scope of changes has grown) or leave it alone. Don't create duplicates.

### 3. Determine affected packages

The packages in this monorepo are:

| Package                  | Path                      |
| ------------------------ | ------------------------- |
| `@stlite/common`         | `packages/common`         |
| `@stlite/kernel`         | `packages/kernel`         |
| `@stlite/react`          | `packages/react`          |
| `@stlite/browser`        | `packages/browser`        |
| `@stlite/desktop`        | `packages/desktop`        |
| `@stlite/sharing`        | `packages/sharing`        |
| `@stlite/sharing-common` | `packages/sharing-common` |
| `@stlite/sharing-editor` | `packages/sharing-editor` |
| `@stlite/tooling`        | `packages/tooling`        |

Changes to the `streamlit/` submodule primarily affect `@stlite/kernel` (which builds the Streamlit wheel).

#### DevDependency consumers must be listed explicitly

Changesets does not automatically bump packages that consume a changed package via `devDependencies` (see https://github.com/changesets/changesets/pull/1159). Because of this, when a package is changed, its **devDependency consumers** must also be listed in the changeset explicitly.

The devDependency consumer graph (only listing devDependency edges, since regular dependency edges are handled automatically by changesets):

- `@stlite/kernel` is consumed as devDependency by: `@stlite/react`, `@stlite/desktop`
- `@stlite/react` is consumed as devDependency by: `@stlite/browser`
- `@stlite/common` is consumed as devDependency by: `@stlite/react`, `@stlite/browser`, `@stlite/desktop`
- `@stlite/tooling` is consumed as devDependency by: `@stlite/kernel`, `@stlite/desktop`

So for example, if `@stlite/kernel` has a `minor` change, you should also list `@stlite/react`, `@stlite/desktop`, and transitively `@stlite/browser` (which dev-depends on `@stlite/react`) — all with the same bump type.

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

### 6. Confirm with the user

Show the user the changeset content before writing it, or write it and show the result. If any judgment calls were ambiguous (e.g., patch vs minor), explain your reasoning.
