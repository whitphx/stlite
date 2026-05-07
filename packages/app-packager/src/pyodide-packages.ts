import path from "node:path";
import fsPromises from "node:fs/promises";
import { consoleLogger, type Logger } from "./logger.js";

interface PackageInfo {
  name: string;
  version: string;
  file_name: string;
  depends: string[];
}

export class PrebuiltPackagesDataReader {
  private sourceUrl: string;
  private isRemote: boolean;
  private logger: Logger;
  private _data: Record<string, PackageInfo> | null = null;

  constructor(sourceUrl: string, logger: Logger = consoleLogger) {
    // Path logic mirrors https://github.com/pyodide/pyodide/blob/0.25.1/src/js/compat.ts#L122
    if (sourceUrl.startsWith("file://")) {
      sourceUrl = sourceUrl.slice("file://".length);
    }
    this.sourceUrl = sourceUrl;
    this.isRemote = sourceUrl.includes("://");
    this.logger = logger;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async readJson(filepath: string): Promise<any> {
    if (this.isRemote) {
      // Remote URL is always '/'-separated, so use path.posix instead of
      // plain `path.join` (which emits `\` on Windows).
      const url = path.posix.join(this.sourceUrl, filepath);
      this.logger.debug(`Fetching ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to download ${url}: ${res.status} ${res.statusText}`,
        );
      }
      return await res.json();
    } else {
      const url = path.join(this.sourceUrl, filepath);
      this.logger.debug(`Reading ${url}`);
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

    this.logger.info(`Load pyodide-lock.json`);
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
