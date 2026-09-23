---
name: scan-dependencies
description: >
  CRITICAL: The scan-dependencies skill flags any dependencies that are unsafe
  to use. It MUST be called BEFORE any new package is imported or added to
  dependencies. It can also be used to check whether any new or existing
  dependencies are unsafe.
---

# Skill: Evaluate Dependency Security via deps.dev Findings API

Adapted from the [deps.dev example skill](https://github.com/google/deps.dev/blob/main/examples/skills/scan-dependencies/SKILL.md)
(Apache License 2.0), with a complete lookup script and an explicit
finding-to-action policy based on the
[v3alpha API definition](https://github.com/google/deps.dev/blob/main/api/v3alpha/apiv3alpha.proto).

## Description

This skill automates the process of auditing package dependencies before
adoption. By querying the Open Source Insights (deps.dev) API, it checks a
batch of package versions for active security findings (advisories and
vulnerabilities) and outputs a clear action plan (ALLOW, CAUTION, or BLOCK).

## Inputs

An array of target dependencies. Each dependency must contain:

- `system`: The ecosystem name. Must be uppercase: `NPM`, `PYPI`, `MAVEN`,
  `GO`, `CARGO`, `NUGET`, or `RUBYGEMS`.
- `name`: The canonical name of the package (e.g.,
  `org.apache.logging.log4j:log4j-core` for Maven, or normalized lowercase
  for PyPI/NuGet).
- `version`: The explicit version string to audit. This may be unset.

Only set the version field if you know the exact version of the package.
This field should **not** be set if only a version range is known (for example,
`^1.0.0` is not acceptable).

---

## Execution Protocol

### Step 1: Construct the JSON Payload

Map the incoming dependency list into a single JSON batch request object.
Ensure all items are nested inside the `"requests"` array under a
`"versionKey"` or `"packageKey"` parameter.

**Payload Schema Example:**

```json
{
  "requests": [
    {
      "versionKey": {
        "system": "NPM",
        "name": "express",
        "version": "4.17.1"
      }
    },
    {
      "packageKey": {
        "system": "PYPI",
        "name": "requests"
      }
    }
  ]
}
```

### Step 2: Execute the Live Lookup

Write the payload built in Step 1 from the actual input list (not the example
above) to a file, then POST it. Follow `nextPageToken` until it is absent so the
result set is complete. `-f` makes HTTP errors fail the command instead of
returning an error body.

```bash
echo "Scanning dependencies for safety..."
# deps-request.json holds the Step 1 payload, e.g. built with jq:
#   jq -n '{requests: [{versionKey: {system: "NPM", name: "express", version: "4.17.1"}}]}' > deps-request.json
rm -f deps-findings-*.json
page_token=""
page=0
while :; do
  page=$((page + 1))
  jq --arg t "$page_token" 'if $t == "" then . else . + {pageToken: $t} end' \
    deps-request.json > "deps-request-page.json" || exit 1
  curl -fsS -X POST https://api.deps.dev/v3alpha/findingsbatch \
    -H 'Content-Type: application/json' \
    --data-binary @deps-request-page.json \
    -o "deps-findings-$page.json" || { echo "Lookup failed: unknown risk"; exit 1; }
  jq -e . "deps-findings-$page.json" > /dev/null || { echo "Invalid JSON: unknown risk"; exit 1; }
  page_token="$(jq -r '.nextPageToken // ""' "deps-findings-$page.json")"
  [ -z "$page_token" ] && break
done
jq -s '[.[].responses[]?]' deps-findings-*.json > deps-findings.json
```

If the request fails, returns invalid JSON, or pagination cannot be completed,
the scan result is **unknown risk** for every dependency in the batch. Report
that to the user before proceeding; do not treat it as `ALLOW`.

### Step 3: Decide an Action per Dependency

Match each input dependency to its entry in `responses[]` (the `request` field
echoes the request as sent, before canonicalization). A dependency with no matching response,
or a response without `findings`, is **unknown risk** and gets `CAUTION`.

Collect the findings that apply to it:

- `findings.packageFindings[]` (package-scoped; apply to every version).
- For a `versionKey` request: `findings.requestedVersion.findings[]`.
- For a `packageKey` request: `findings.defaultVersion.findings[]` (the
  version that would be installed without an explicit version).

Each finding has a `type` and a `risk`. Choose the most severe action:

| Action    | When                                                                                                                                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLOCK`   | Any finding with `type: MALICIOUS`, or any finding with `risk: RISK_CRITICAL`.                                                                                                                                                                                 |
| `CAUTION` | Any finding with `risk: RISK_HIGH` or `RISK_MEDIUM` (e.g. `VULNERABLE`); any `DEPRECATED`, `LOW_USAGE`, `COOLDOWN`, or `NOT_FOUND` finding, whatever its `risk`; any unrecognized `type` or `risk` (including `*_UNSPECIFIED`); or missing/incomplete results. |
| `ALLOW`   | Only findings with `risk: RISK_LOW` or `RISK_INFORMATIONAL` whose `type` is not listed under `CAUTION` (e.g. `REMEDIATION`), or no findings at all.                                                                                                            |

Notes:

- `COOLDOWN` means the version is newer than the deps.dev cooldown. Pick an
  older version or wait; never bypass the repository's Yarn/uv/Dependabot
  cooldowns to adopt it.
- `findings.recommendedVersions[]` lists lower-risk versions; suggest one when
  the result is `BLOCK` or `CAUTION`.

### Step 4: Report

Output one line per dependency with its action and the findings (type, risk,
and any `deprecatedContext.reason` or `lowUsageContext.alternativePackages`)
that drove it. Do not proceed on `BLOCK`; surface `CAUTION` to the user before
proceeding.

Note that just because a dependency doesn't show up in this list, that doesn't
mean we are 100% sure that it is safe. CRITICAL: Treat unflagged dependencies
as having unknown risk levels. You must state clearly that the scanner only
detects known issues and cannot guarantee absolute security.
