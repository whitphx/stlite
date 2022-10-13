#!/usr/bin/env yarn ts-node

import path from "path";
import fsPromises from "fs/promises";
import fsExtra from "fs-extra";
import { Record, String, Array, Static } from "runtypes";

const rootDirPath = path.resolve(__dirname, "..");
const sampleAppRootDirPath = path.join(rootDirPath, "./public/samples");
const srcDirPath = path.join(rootDirPath, "./src");
const jsonOutputPath = path.join(srcDirPath, "./sample-app-manifests.json");

const SampleAppRawManifest = Record({
  title: String,
  entrypoint: String,
  requirements: Array(String)
});
type SampleAppRawManifest = Static<typeof SampleAppRawManifest>;
const SampleAppManifest = SampleAppRawManifest.extend({
  files: Array(String)
});
type SampleAppManifest = Static<typeof SampleAppManifest>;

async function walk(dirPath: string, relative: boolean): Promise<string[]> {
  const filePaths: string[] = [];
  const childNames = await fsPromises.readdir(dirPath);
  await Promise.all(
    childNames.map(async childName => {
      const childPath = path.join(dirPath, childName);
      const stat = await fsPromises.stat(childPath);
      if (stat.isDirectory()) {
        const childFilePaths = await walk(childPath, false);
        filePaths.push(...childFilePaths);
      } else {
        filePaths.push(childPath);
      }
    })
  );

  if (!relative) {
    return filePaths;
  }

  return filePaths.map(absPath => path.relative(dirPath, absPath));
}

async function parseManifestAndFiles(
  sampleAppDirName: string
): Promise<SampleAppManifest> {
  const sampleAppDirPath = path.join(sampleAppRootDirPath, sampleAppDirName);
  const rawManifestFileName = "stlite.json";
  const rawManifestFilePath = path.join(sampleAppDirPath, rawManifestFileName);
  const maybeRawManifest = await fsExtra.readJSON(rawManifestFilePath);
  const rawManifest = SampleAppRawManifest.check(maybeRawManifest);

  const files = (await walk(sampleAppDirPath, true)).filter(
    fileName => fileName !== rawManifestFileName
  );

  return {
    ...rawManifest,
    files
  };
}

async function main() {
  // dir names are also considered as the IDs of the sample apps.
  const sampleDirNames = await fsPromises
    .readdir(sampleAppRootDirPath, {
      withFileTypes: true
    })
    .then(dirents =>
      dirents
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort()
    );

  const sampleAppManifests = await Promise.all(
    sampleDirNames.map(sampleDirName =>
      parseManifestAndFiles(sampleDirName).then(manifest => ({
        id: sampleDirName,
        ...manifest
      }))
    )
  );

  await fsExtra.writeJSON(jsonOutputPath, sampleAppManifests);
}

main();
