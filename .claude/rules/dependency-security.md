# Dependency security

When a task adds or updates a third-party dependency:

1. Invoke the project `scan-dependencies` skill before proceeding with the dependency change. Query the exact candidate version when it is known; if only a package or range is known, scan that first and scan the exact resolved version once available.
2. Do not proceed on a `BLOCK` result. Surface `CAUTION` or unknown-risk results to the user before proceeding.
3. Keep the repository's fixed cooldowns in force. Do not pass Yarn's `--no-time-gate`, add cooldown exemptions, or relax the Yarn/uv/Dependabot cooldown settings merely to unblock an update.
4. Do not implement a custom GOSSIP-aware resolver, registry proxy, or CI scanner. Wait for an official ecosystem integration for dynamic cooldown enforcement.

Ordinary installs from an unchanged lockfile do not require a new GOSSIP lookup; this rule applies when dependency resolution is being changed.
