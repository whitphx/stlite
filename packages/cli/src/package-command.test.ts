import { readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { targetVersionSatisfies } from "./package-command.js";

describe("targetVersionSatisfies", () => {
  it("treats the workspace protocol as always compatible", () => {
    // Inside the monorepo the versions are linked; there is no drift to check.
    expect(targetVersionSatisfies("workspace:^", "0.1.0")).toBe(true);
    expect(targetVersionSatisfies("workspace:*", "99.0.0")).toBe(true);
  });

  it("accepts an installed version within the declared caret range", () => {
    expect(targetVersionSatisfies("^0.1.0", "0.1.0")).toBe(true);
    expect(targetVersionSatisfies("^0.1.0", "0.1.9")).toBe(true);
    expect(targetVersionSatisfies("^1.2.0", "1.5.3")).toBe(true);
  });

  it("rejects a drifted version outside the range", () => {
    // A published @stlite/cli@x pins the target at ^x; a newer, interface-
    // changed target (a 0.x minor is a breaking bump) must be rejected.
    expect(targetVersionSatisfies("^0.1.0", "0.2.0")).toBe(false);
    expect(targetVersionSatisfies("^0.1.0", "1.0.0")).toBe(false);
    expect(targetVersionSatisfies("^1.0.0", "2.0.0")).toBe(false);
  });

  it("considers prereleases of an in-range version compatible", () => {
    expect(targetVersionSatisfies("^0.1.0", "0.1.5-next.1")).toBe(true);
  });
});

describe("target dependency declarations in package.json", () => {
  const manifest = JSON.parse(
    readFileSync(
      path.join(
        fileURLToPath(new URL(".", import.meta.url)),
        "..",
        "package.json",
      ),
      "utf8",
    ),
  );
  const targets = ["@stlite/browser", "@stlite/desktop", "@stlite/cloudflare"];

  it("keeps runtime targets in devDependencies (the drift-check range source)", () => {
    // resolveTargetPackage reads each target's supported range from
    // devDependencies; dropping one from there would silently disable its check.
    for (const t of targets) {
      expect(manifest.devDependencies?.[t]).toBeDefined();
    }
  });

  it("does not declare runtime targets as peer dependencies", () => {
    // A peer dependency would make changesets force a major bump of the CLI on
    // every target release.
    for (const t of targets) {
      expect(manifest.peerDependencies?.[t]).toBeUndefined();
    }
  });
});
