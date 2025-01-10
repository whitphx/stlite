#!/usr/bin/env node
import fs from "fs";
import path from "path";

interface PackageJson {
  resolutions?: {
    [key: string]: string;
  };
}

interface LernaJson {
  version?: string;
}

function validateVersion(version: string): boolean {
  // Matches standard versions and pre-release versions (e.g., 1.2.3, 1.2.3-alpha.1)
  const versionRegex = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
  return versionRegex.test(version);
}

function updateResolutions(): void {
  try {
    const rootDir = process.cwd();
    const packageJsonPath = path.join(rootDir, "package.json");
    const lernaJsonPath = path.join(rootDir, "lerna.json");

    // Verify files exist
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found in the current directory");
    }
    if (!fs.existsSync(lernaJsonPath)) {
      throw new Error("lerna.json not found in the current directory");
    }

    // Read and parse lerna.json
    let lernaConfig: LernaJson;
    try {
      lernaConfig = JSON.parse(fs.readFileSync(lernaJsonPath, "utf-8"));
    } catch (error) {
      throw new Error(`Failed to parse lerna.json: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!lernaConfig.version) {
      throw new Error("No version field found in lerna.json");
    }

    const currentVersion = lernaConfig.version;
    if (!validateVersion(currentVersion)) {
      throw new Error(`Invalid version format in lerna.json: ${currentVersion}`);
    }

    // Read and parse package.json
    let packageJson: PackageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    } catch (error) {
      throw new Error(`Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Ensure resolutions field exists
    if (!packageJson.resolutions) {
      throw new Error("No resolutions field found in package.json");
    }

    // Update @stlite/kernel version in resolutions
    packageJson.resolutions["@stlite/kernel"] = currentVersion;

    // Write back to package.json with proper formatting
    try {
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n"
      );
      console.log(`✓ Successfully updated @stlite/kernel resolution to version ${currentVersion}`);
    } catch (error) {
      throw new Error(`Failed to write package.json: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run the update if this file is being executed directly
if (require.main === module) {
  updateResolutions();
}
