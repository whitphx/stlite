import * as path from "path";
import * as fsPromises from "fs/promises";
import * as s from "superstruct";
import { type App } from "electron";

export const DesktopAppManifestStruct = s.object({
  entrypoint: s.string(),
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

/**
 * Resolve placeholders in a path string using Electron's app.getPath API.
 * Example: resolvePathWithApp(app, "{{home}}/my-app") => "/home/user/my-app"
 */
function resolvePathWithApp(app: App, inputPath: string): string {
  const placeholderRegex = /\{\{(.*?)\}\}/g; // Regex to match placeholders like {{home}}, {{appData}}, etc.

  return inputPath.replace(placeholderRegex, (match, placeholder) => {
    try {
      // Try to resolve the placeholder using Electron's app.getPath API
      const resolvedPath = app.getPath(placeholder); // Ref: https://www.electronjs.org/docs/latest/api/app#appgetpathname
      return resolvedPath; // Return the resolved path if successful
    } catch (error) {
      console.warn(`Failed to resolve placeholder ${placeholder} (${error})`);
      return match; // Return the original placeholder if it cannot be resolved
    }
  });
}

export function resolveNodefsMountpoints(
  app: App,
  nodefsMountpoints: NonNullable<DesktopAppManifest["nodefsMountpoints"]>,
): NonNullable<DesktopAppManifest["nodefsMountpoints"]> {
  return Object.fromEntries(
    Object.entries(nodefsMountpoints).map(([key, value]) => {
      return [key, resolvePathWithApp(app, value)];
    }),
  );
}

export function ensureNodefsMountpoints(
  nodefsMountpoints: NonNullable<DesktopAppManifest["nodefsMountpoints"]>,
): Promise<void> {
  return Promise.all(
    Object.values(nodefsMountpoints).map((mountpoint) =>
      fsPromises.mkdir(mountpoint, { recursive: true }),
    ),
  )
    .catch((error) => {
      console.error("Failed to create nodefs mountpoints", error);
    })
    .then();
}
