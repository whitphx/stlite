import fetch from "node-fetch";
import { makePyodideUrl } from "./url";

interface PackageInfo {
  name: string;
  version: string;
  file_name: string;
  depends: string[];
}
export class PrebuiltPackagesData {
  private static _instance: PrebuiltPackagesData;
  private _data: Record<string, PackageInfo> | null = null;

  private constructor() {}

  private static async loadPrebuiltPackageData(): Promise<
    Record<string, PackageInfo>
  > {
    const url = makePyodideUrl("pyodide-lock.json");

    console.log(`Load the Pyodide pyodide-lock.json from ${url}`);
    const res = await fetch(url, undefined);
    const resJson = await res.json();

    return resJson.packages;
  }

  static async getInstance(): Promise<PrebuiltPackagesData> {
    if (this._instance == null) {
      this._instance = new PrebuiltPackagesData();
      this._instance._data = await this.loadPrebuiltPackageData();
    }
    return this._instance;
  }

  public getPackageInfoByName(pkgName: string): PackageInfo {
    if (this._data == null) {
      throw new Error("The package data is not loaded yet.");
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
