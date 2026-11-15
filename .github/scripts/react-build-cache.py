#!/usr/bin/env python3
"""Helpers for .github/actions/react-build-cache.

The action caches what `make react` builds. A cached build can be restored
for a checkout whose inputs differ from the ones it was built from, as long as
Make can tell which of its targets that difference makes stale. Make judges by
mtime, and a fresh checkout gives every file the same one, so this script does
the judging by content: each cached build carries a manifest of its inputs'
git modes and blob hashes, and `plan` compares it with the checkout's.

Subcommands:

  inputs
      Print the manifest of the checkout's inputs: one "<mode> <blob> <path>"
      line per tracked file @stlite/react's build can read, the Streamlit
      submodule's files listed one by one. The mode is in it because a change
      of it alone (a file made executable, or a symlink replaced by a file
      holding its target's path) keeps the blob.

  tracked
      Print every tracked path, the submodule's included, one per line.

  plan OLD_MANIFEST NEW_MANIFEST MAKE_DATABASE
      Decide whether a build made from OLD_MANIFEST's inputs can be restored
      for NEW_MANIFEST's. MAKE_DATABASE is `make -pq .make/react/.built`.
      If every input that was added or changed is a prerequisite Make declares
      somewhere under .make/react/.built, and none was removed, print those
      inputs, one per line, and exit 0: touching them newer than the restored
      build makes Make rebuild exactly what is built from them, and everything
      above that, which is how `make` works locally. Otherwise exit 3 with the
      reason on stderr, and the build is done from scratch: an input Make
      doesn't declare (the Streamlit frontend sources @stlite/react compiles,
      for one) could have changed what a target builds without making it
      stale.
"""

import collections
import re
import subprocess
import sys

SUBMODULE = "streamlit"

# The tracked files left out of the manifest, as in the cache key before
# it: no build step reads them, or they are built on @stlite/react and can't
# be its inputs. .github is handled by the key's prefix.
EXCLUDES = [
    ".changeset",
    ".claude",
    ".github",
    ".lintstagedrc.json",
    ".oxfmtrc.json",
    ".oxlintrc.json",
    "AGENTS.md",
    "CHANGELOG.md",
    "CLAUDE.md",
    "CONTRIBUTING.md",
    "README.md",
    "cspell.json",
    "docs",
    "packages/browser",
    "packages/desktop",
    "packages/sharing",
]

ROOT_TARGET = ".make/react/.built"


def ls_files(*args, cwd=None):
    out = subprocess.run(
        ["git", "ls-files", "--stage", "-z", *args],
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    for entry in out.split("\0"):
        if not entry:
            continue
        meta, path = entry.split("\t", 1)
        mode, blob, _stage = meta.split()
        yield mode, blob, path


def inputs():
    pathspecs = ["--", "."] + [f":(exclude){p}" for p in EXCLUDES]
    lines = []
    for mode, blob, path in ls_files(*pathspecs):
        if mode == "160000":
            # The submodule's commit: its files are listed below instead.
            continue
        lines.append((path, mode, blob))
    for mode, blob, path in ls_files(cwd=SUBMODULE):
        lines.append((f"{SUBMODULE}/{path}", mode, blob))
    for path, mode, blob in sorted(lines):
        print(mode, blob, path)


def tracked():
    for mode, _blob, path in ls_files():
        if mode != "160000":
            print(path)
    for _mode, _blob, path in ls_files(cwd=SUBMODULE):
        print(f"{SUBMODULE}/{path}")


def read_manifest(path):
    manifest = {}
    with open(path) as f:
        for line in f:
            mode, blob, name = line.rstrip("\n").split(" ", 2)
            manifest[name] = (mode, blob)
    return manifest


def declared_prerequisites(database):
    """Every file Make declares, directly or not, as a prerequisite of
    ROOT_TARGET, read from the database `make -p` prints."""
    rules = collections.defaultdict(set)
    not_a_target = False
    rule = re.compile(r"^([^\s#:=][^:=]*?):(?![:=])\s*(.*)$")
    with open(database) as f:
        for line in f:
            line = line.rstrip("\n")
            if line.startswith("# Not a target"):
                not_a_target = True
                continue
            if not line:
                not_a_target = False
                continue
            if line.startswith(("#", "\t")) or not_a_target:
                continue
            m = rule.match(line)
            if not m:
                continue
            prerequisites = m.group(2).replace("|", " ").split()
            for target in m.group(1).split():
                rules[target].update(prerequisites)
    if ROOT_TARGET not in rules:
        raise SystemExit(f"{ROOT_TARGET} is not in the Make database {database}")
    seen = set()
    stack = [ROOT_TARGET]
    while stack:
        for prerequisite in rules.get(stack.pop(), ()):
            if prerequisite not in seen:
                seen.add(prerequisite)
                stack.append(prerequisite)
    return seen


def plan(old_path, new_path, database):
    old = read_manifest(old_path)
    new = read_manifest(new_path)
    removed = sorted(set(old) - set(new))
    changed = sorted(p for p, entry in new.items() if old.get(p) != entry)

    def fail(reason, paths):
        shown = "\n".join(f"  {p}" for p in paths[:20])
        more = f"\n  ... and {len(paths) - 20} more" if len(paths) > 20 else ""
        print(f"{reason}:\n{shown}{more}", file=sys.stderr)
        sys.exit(3)

    if removed:
        fail("Inputs removed since the cached build", removed)
    undeclared = sorted(set(changed) - declared_prerequisites(database))
    if undeclared:
        fail("Inputs changed that Make doesn't declare as prerequisites", undeclared)
    for path in changed:
        print(path)


def main(argv):
    if argv[:1] == ["inputs"] and len(argv) == 1:
        inputs()
    elif argv[:1] == ["tracked"] and len(argv) == 1:
        tracked()
    elif argv[:1] == ["plan"] and len(argv) == 4:
        _command, old_path, new_path, database = argv
        plan(old_path=old_path, new_path=new_path, database=database)
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
