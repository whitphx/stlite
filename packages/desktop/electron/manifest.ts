import * as path from "path";
import * as fsPromises from "fs/promises";
import * as s from "superstruct";

export const DesktopAppManifestStruct = s.object({
  embed: s.defaulted(s.boolean(), false),
  idbfsMountpoints: s.optional(s.array(s.string())),
  nodeJsWorker: s.defaulted(s.boolean(), false),
  nodefsMountpoints: s.optional(s.record(s.string(), s.string())),
});
export type DesktopAppManifest = s.Infer<typeof DesktopAppManifestStruct>;

export async function readManifest(): Promise<DesktopAppManifest> {
  const manifestPath = path.resolve(__dirname, "../stlite-manifest.json");
  const manifestText = await fsPromises.readFile(manifestPath, {
    encoding: "utf-8",
  });
  const maybeManifestData = JSON.parse(manifestText);

  s.assert(maybeManifestData, DesktopAppManifestStruct);
  return maybeManifestData;
}
