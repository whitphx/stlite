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
  appMenu: s.defaulted(s.boolean(), true),
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
 * Validates a candidate manifest-data object against `DesktopAppManifestStruct`,
 * applying schema defaults and rejecting incompatible field combinations.
 */
export function coerceDesktopAppManifest(obj: unknown): DesktopAppManifest {
  const manifestData = s.mask(obj ?? {}, DesktopAppManifestStruct);

  if (manifestData.nodeJsWorker) {
    if (manifestData.idbfsMountpoints != null) {
      throw new Error(
        "The `idbfsMountpoints` field is not allowed when `nodeJsWorker` is true.",
      );
    }
  } else {
    if (manifestData.nodefsMountpoints != null) {
      throw new Error(
        "The `nodefsMountpoints` field is not allowed when `nodeJsWorker` is false.",
      );
    }
  }

  return manifestData;
}

export interface DumpManifestOptions {
  /** Source object — typically `package.json#stlite.desktop`, or constructed by the CLI. */
  packageJsonStliteDesktopField: unknown;
  manifestFilePath: string;
  /** Backward-compat fallback values applied before validation. */
  fallbacks?: Partial<{ entrypoint: string }>;
}

export async function dumpManifest(
  options: DumpManifestOptions,
): Promise<void> {
  const manifestData = coerceDesktopAppManifest({
    ...(options.packageJsonStliteDesktopField as object | undefined),
    ...options.fallbacks,
  });
  await fsPromises.writeFile(
    options.manifestFilePath,
    JSON.stringify(manifestData, null, 2),
    { encoding: "utf-8" },
  );
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
