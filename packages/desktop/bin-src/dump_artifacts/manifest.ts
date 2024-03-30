import fsPromises from "fs/promises";
import * as s from "superstruct";
import {
  type DesktopAppManifest,
  DesktopAppManifestStruct,
} from "../../electron/manifest";

export function coerceDesktopAppManifest(obj: any): DesktopAppManifest {
  const manifestData = s.create(obj ?? {}, DesktopAppManifestStruct);

  if (manifestData.nodeJsWorker) {
    if (manifestData.idbfsMountpoints != null) {
      throw new Error(
        "The `idbfsMountpoints` field is not allowed when `nodeJsWorker` is true."
      );
    }
  } else {
    if (manifestData.nodefsMountpoints != null) {
      throw new Error(
        "The `nodefsMountpoints` field is not allowed when `nodeJsWorker` is false."
      );
    }
  }

  return manifestData;
}

interface DumpManifestOptions {
  packageJsonPath: string;
  manifestFilePath: string;
}
export async function dumpManifest(options: DumpManifestOptions) {
  const packageJson = require(options.packageJsonPath);
  const packageJsonStliteField = packageJson.stlite?.desktop;

  const manifestData = coerceDesktopAppManifest(packageJsonStliteField);

  const manifestDataStr = JSON.stringify(manifestData, null, 2);
  console.log(`Dump the manifest file -> ${options.manifestFilePath}`);
  console.log(manifestDataStr);
  await fsPromises.writeFile(options.manifestFilePath, manifestDataStr, {
    encoding: "utf-8",
  });
}
