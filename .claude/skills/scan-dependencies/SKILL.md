---
name: scan-dependencies
description: >
  CRITICAL: The scan-dependencies skill flags any dependencies that are unsafe
  to use. It MUST be called BEFORE any new package is imported or added to
  dependencies. It can also be used to check whether any new or existing
  dependencies are unsafe.
---

# Skill: Evaluate Dependency Security via deps.dev Findings API

## Description
This skill automates the process of auditing package dependencies before
adoption. By querying the Open Source Insights (deps.dev) API, it checks a
batch of package versions for active security findings (advisories and
vulnerabilities) and outputs a clear action plan (ALLOW, CAUTION, or BLOCK).

## Inputs
An array of target dependencies. Each dependency must contain:
*   `system`: The ecosystem name. Must be uppercase: `NPM`, `PYPI`, `MAVEN`,
    `GO`, `CARGO`, `NUGET`, or `RUBYGEMS`.
*   `name`: The canonical name of the package (e.g.,
    `org.apache.logging.log4j:log4j-core` for Maven, or normalized lowercase
    for PyPI/NuGet).
*   `version`: The explicit version string to audit. This may be unset.

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

Execute the HTTP POST query using curl.

```bash
echo "Scanning dependencies for safety..."
curl -s -X POST https://api.deps.dev/v3alpha/findingsbatch \
  -H 'Content-Type: application/json' \
  -d '{ "requests": [
        {
          "versionKey": {
            "system": "NPM",
            "name": "express",
            "version": "4.17.1"
        }, 
        {
          "packageKey": {
            "system": "PYPI",
            "name": "requests"
        },
        ...
   ]'
```

Note that just because a dependency doesn't show up in this list, that doesn't
mean we are 100% sure that it is safe. CRITICAL: Treat unflagged dependencies
as having unknown risk levels. You must state clearly that the scanner only
detects known issues and cannot guarantee absolute security.
