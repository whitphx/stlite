import fsPromises from "node:fs/promises";
import * as s from "superstruct";
import {
  type DesktopAppManifest,
  DesktopAppManifestStruct,
} from "../../electron/manifest";

export function coerceDesktopAppManifest(obj: unknown): DesktopAppManifest {
  const manifestData = s.mask(obj ?? {}, DesktopAppManifestStruct);

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
  packageJsonStliteDesktopField: any;
  manifestFilePath: string;
  fallbacks?: Partial<{
    // For backward compatibility for the deprecated command line options
    entrypoint: string;
  }>;
}
export async function dumpManifest(options: DumpManifestOptions) {
  const manifestData = coerceDesktopAppManifest({
    ...options.packageJsonStliteDesktopField,
    ...options.fallbacks,
  });

  const manifestDataStr = JSON.stringify(manifestData, null, 2);
  console.log(`Dump the manifest file -> ${options.manifestFilePath}`);
  console.log(manifestDataStr);
  await fsPromises.writeFile(options.manifestFilePath, manifestDataStr, {
    encoding: "utf-8",
  });
}
