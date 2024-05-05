import path from "node:path";
import fsPromises from "node:fs/promises";
import { logger } from "./logger";

export class PyodideResourceLoader {
  private readonly basePath: string;
  private readonly isRemote: boolean;

  private prebuiltPackageInfoLoader: PrebuiltPackageInfoLoader;
  constructor(basePath: string) {
    // These path logics are based on https://github.com/pyodide/pyodide/blob/0.25.1/src/js/compat.ts#L122
    if (basePath.startsWith("file://")) {
      // handle file:// with filesystem operations rather than with fetch.
      basePath = basePath.slice("file://".length);
    }
    this.basePath = basePath;
    this.isRemote = basePath.includes("://");

    this.prebuiltPackageInfoLoader = new PrebuiltPackageInfoLoader(this);
  }

  async download(filename: string, dstDir: string): Promise<void> {
    const srcPath = path.join(this.basePath, filename);
    const dstPath = path.join(dstDir, filename);

    if (this.isRemote) {
      logger.debug(`Downloading ${srcPath} from ${this.basePath}`);
      const res = await fetch(srcPath);
      if (!res.ok) {
        throw new Error(
          `Failed to download ${srcPath}: ${res.status} ${res.statusText}`
        );
      }
      const buf = await res.arrayBuffer();
      await fsPromises.writeFile(dstPath, Buffer.from(buf));
    } else {
      logger.debug(`Copying ${srcPath} to ${dstPath}`);
      await fsPromises.copyFile(srcPath, dstPath);
    }
  }

  async readJson(filename: string): Promise<any> {
    const srcPath = path.join(this.basePath, filename);

    if (this.isRemote) {
      logger.debug(`Downloading ${srcPath} from ${this.basePath}`);
      const res = await fetch(srcPath);
      if (!res.ok) {
        throw new Error(
          `Failed to download ${srcPath}: ${res.status} ${res.statusText}`
        );
      }
      return await res.json();
    } else {
      logger.debug(`Reading ${srcPath}`);
      const buf = await fsPromises.readFile(srcPath);
      return JSON.parse(buf.toString());
    }
  }

  getPackageInfoByName(pkgName: string) {
    return this.prebuiltPackageInfoLoader.getPackageInfoByName(pkgName);
  }
}

interface PackageInfo {
  name: string;
  version: string;
  file_name: string;
  depends: string[];
}
class PrebuiltPackageInfoLoader {
  private _data: Record<string, PackageInfo> | null = null;

  constructor(private resourceLoader: PyodideResourceLoader) { }

  private async loadPrebuiltPackageData(): Promise<
    Record<string, PackageInfo>
  > {
    logger.info(`Load pyodide-lock.json`);
    const resJson = await this.resourceLoader.readJson("pyodide-lock.json");

    return resJson.packages;
  }

  public async getPackageInfoByName(pkgName: string): Promise<PackageInfo> {
    if (this._data == null) {
      this._data = await this.loadPrebuiltPackageData();
    }

    const pkgInfo = Object.values(this._data).find(
      (pkg) => pkg.name === pkgName
    );
    if (pkgInfo == null) {
      throw new Error(`Package ${pkgName} is not found in the lock file.`);
    }
    return pkgInfo;
  }
}
