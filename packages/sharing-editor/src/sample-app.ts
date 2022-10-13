import { AppData, File } from "@stlite/sharing-common";
import sampleAppManifests from "./sample-app-manifests.json"; // This file is generated by bin/gen-sample-app-manifests-json.ts at build time.

const sampleAppBasePath = "/samples";

const TEXT_EXTS = [".py", ".txt", ".csv", ".md"];
async function loadFiles(
  fileNames: string[],
  sampleAppDirName: string
): Promise<AppData["files"]> {
  const fileNameAndUrls = fileNames.map((fileName) => [
    fileName,
    `${sampleAppBasePath}/${sampleAppDirName}/${fileName}`,
  ]);
  const fileNameAndContents = await Promise.all(
    fileNameAndUrls.map(
      async ([fileName, url]): Promise<[string, File["content"]]> => {
        const res = await fetch(url);
        if (res.status !== 200) {
          throw new Error(`Failed to fetch "${url}" (${res.status})`);
        }

        if (TEXT_EXTS.some((text_ext) => url.endsWith(text_ext))) {
          return res.text().then((text) => [
            fileName,
            {
              $case: "text",
              text,
            },
          ]);
        } else {
          return res.arrayBuffer().then((ab) => [
            fileName,
            {
              $case: "data",
              data: new Uint8Array(ab),
            },
          ]);
        }
      }
    )
  );

  const files: AppData["files"] = {};
  fileNameAndContents.forEach(([name, fileContent]) => {
    files[name] = {
      content: fileContent,
    };
  });

  return files;
}

export async function loadSampleAppData(sampleAppId: string | null) {
  const sampleAppManifest =
    sampleAppId == null
      ? sampleAppManifests[0]
      : sampleAppManifests.find((manifest) => manifest.id === sampleAppId);
  if (sampleAppManifest == null) {
    throw new Error(`No sample app found for ${sampleAppId}`);
  }

  const files = await loadFiles(
    sampleAppManifest["files"],
    sampleAppManifest.id
  );

  const appData: AppData = {
    entrypoint: sampleAppManifest.entrypoint,
    requirements: sampleAppManifest.requirements,
    files,
  };

  return appData;
}
