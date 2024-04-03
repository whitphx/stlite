import fetch from "node-fetch";
import { makePyodideUrl } from "./url";

interface PackageInfo {
  name: string;
  version: string;
  file_name: string;
  depends: string[];
}
export class PyodidePrebuiltPackagesData {
  private static _instance: PyodidePrebuiltPackagesData;
  private _data: Record<string, PackageInfo> | null = null;

  private constructor() {}

  private static async loadPyodidePrebuiltPackageData(): Promise<
    Record<string, PackageInfo>
  > {
    const url = makePyodideUrl("pyodide-lock.json");

    console.log(`Load the Pyodide pyodide-lock.json from ${url}`);
    const res = await fetch(url, undefined);
    const resJson = await res.json();

    return resJson.packages;
  }

  static async getInstance(): Promise<PyodidePrebuiltPackagesData> {
    if (this._instance == null) {
      this._instance = new PyodidePrebuiltPackagesData();
      this._instance._data = await this.loadPyodidePrebuiltPackageData();
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
