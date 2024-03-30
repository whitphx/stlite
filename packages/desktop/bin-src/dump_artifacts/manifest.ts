import fsPromises from "fs/promises";
import * as s from "superstruct";
import { DesktopAppManifestStruct } from "../../electron/manifest";

interface DumpManifestOptions {
  packageJsonPath: string;
  manifestFilePath: string;
}
export async function dumpManifest(options: DumpManifestOptions) {
  const packageJson = require(options.packageJsonPath);
  const packageJsonStliteField = packageJson.stlite?.desktop || {};

  const manifestData = s.create(
    packageJsonStliteField,
    DesktopAppManifestStruct
  );

  const manifestDataStr = JSON.stringify(manifestData, null, 2);
  console.log(`Dump the manifest file -> ${options.manifestFilePath}`);
  console.log(manifestDataStr);
  await fsPromises.writeFile(options.manifestFilePath, manifestDataStr, {
    encoding: "utf-8",
  });
}
