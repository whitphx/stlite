#!/usr/bin/env npx tsx

import path from "node:path";
import fsPromises from "node:fs/promises";
import fsExtra from "fs-extra";
import * as s from "superstruct";
import { parseRequirementsTxt } from "@stlite/common";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDirPath = path.resolve(__dirname, "..");
const sampleAppRootDirPath = path.join(rootDirPath, "./public/samples");
const srcDirPath = path.join(rootDirPath, "./src");
const jsonOutputPath = path.join(srcDirPath, "./sample-app-manifests.json");

const SampleAppRawManifestStruct = s.object({
  title: s.string(),
  entrypoint: s.string(),
});
type SampleAppRawManifest = s.Infer<typeof SampleAppRawManifestStruct>;
const SampleAppManifestStruct = s.object({
  title: s.string(),
  entrypoint: s.string(),
  files: s.array(s.string()),
  requirements: s.array(s.string()),
  basePath: s.string(),
});
type SampleAppManifest = s.Infer<typeof SampleAppManifestStruct>;

async function walk(dirPath: string, relative: boolean): Promise<string[]> {
  const filePaths: string[] = [];
  const childNames = await fsPromises.readdir(dirPath);
  await Promise.all(
    childNames.map(async (childName) => {
      const childPath = path.join(dirPath, childName);
      const stat = await fsPromises.stat(childPath);
      if (stat.isDirectory()) {
        const childFilePaths = await walk(childPath, false);
        filePaths.push(...childFilePaths);
      } else {
        filePaths.push(childPath);
      }
    }),
  );

  if (!relative) {
    return filePaths;
  }

  return filePaths.map((absPath) => path.relative(dirPath, absPath));
}

async function readRequirements(
  requirementsTxtPath: string,
): Promise<string[]> {
  try {
    const requirementsTxtData = await fsPromises.readFile(requirementsTxtPath, {
      encoding: "utf-8",
    });
    return parseRequirementsTxt(requirementsTxtData);
  } catch {
    console.log(
      `Failed to read ${requirementsTxtPath}. Use [] as the requirements.`,
    );
    return [];
  }
}

async function parseManifestAndFiles(
  sampleAppDirName: string,
): Promise<SampleAppManifest> {
  const sampleAppDirPath = path.join(sampleAppRootDirPath, sampleAppDirName);

  const rawManifestFileName = "stlite.json";
  const rawManifestFilePath = path.join(sampleAppDirPath, rawManifestFileName);
  const maybeRawManifest = await fsExtra.readJSON(rawManifestFilePath);
  s.assert(maybeRawManifest, SampleAppRawManifestStruct);
  const rawManifest = maybeRawManifest;

  const requirementsTxtName = "requirements.txt";
  const requirementsTxtPath = path.join(sampleAppDirPath, requirementsTxtName);
  const requirements = await readRequirements(requirementsTxtPath);

  const files = (await walk(sampleAppDirPath, true)).filter(
    (fileName) =>
      fileName !== rawManifestFileName && fileName !== requirementsTxtName,
  );

  return {
    ...rawManifest,
    files,
    requirements,
    basePath: sampleAppDirName,
  };
}

const numberPrefixRegex = /^\d+_/;
function extractSampleAppId(sampleAppDirName: string) {
  return sampleAppDirName.replace(numberPrefixRegex, "");
}

async function main() {
  // dir names are also considered as the IDs of the sample apps.
  const sampleDirNames = await fsPromises
    .readdir(sampleAppRootDirPath, {
      withFileTypes: true,
    })
    .then((dirents) =>
      dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort(),
    );

  const sampleAppManifests = await Promise.all(
    sampleDirNames.map((sampleDirName) =>
      parseManifestAndFiles(sampleDirName).then((manifest) => ({
        id: extractSampleAppId(sampleDirName),
        ...manifest,
      })),
    ),
  );

  await fsExtra.writeJSON(jsonOutputPath, sampleAppManifests);
}

main();
