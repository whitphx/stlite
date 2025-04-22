import path from "node:path";
import fsPromises from "node:fs/promises";
import { logger } from "./logger.js";

interface PackageInfo {
  name: string;
  version: string;
  file_name: string;
  depends: string[];
}
export class PrebuiltPackagesDataReader {
  private sourceUrl: string;
  private isRemote: boolean;
  private _data: Record<string, PackageInfo> | null = null;

  constructor(sourceUrl: string) {
    // These path logics are based on https://github.com/pyodide/pyodide/blob/0.25.1/src/js/compat.ts#L122
    if (sourceUrl.startsWith("file://")) {
      // handle file:// with filesystem operations rather than with fetch.
      sourceUrl = sourceUrl.slice("file://".length);
    }
    this.sourceUrl = sourceUrl;
    this.isRemote = sourceUrl.includes("://");
  }

  private async readJson(filepath: string): Promise<any> {
    if (this.isRemote) {
      const url = path.posix.join(this.sourceUrl, filepath); // Remote URL is always '/'-separated so we use path.posix.
      logger.debug(`Fetching ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to download ${url}: ${res.status} ${res.statusText}`,
        );
      }
      return await res.json();
    } else {
      const url = path.join(this.sourceUrl, filepath);
      logger.debug(`Reading ${url}`);
      const buf = await fsPromises.readFile(url);
      return JSON.parse(buf.toString());
    }
  }

  private async loadPrebuiltPackageData(): Promise<
    Record<string, PackageInfo>
  > {
    if (this._data != null) {
      return this._data;
    }

    logger.info(`Load pyodide-lock.json`);
    const lockJson = await this.readJson("pyodide-lock.json");

    this._data = lockJson.packages;
    return lockJson.packages;
  }

  public async getPackageInfoByName(pkgName: string): Promise<PackageInfo> {
    const data = await this.loadPrebuiltPackageData();
    const pkgInfo = Object.values(data).find((pkg) => pkg.name === pkgName);
    if (pkgInfo == null) {
      throw new Error(`Package ${pkgName} is not found in the lock file.`);
    }
    return pkgInfo;
  }
}
