import { version as pyodideVersion } from "pyodide";

export function makePyodideUrl(filename: string): string {
  return `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/${filename}`;
}
