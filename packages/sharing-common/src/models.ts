export type TypedFile = {
  type: "text";
  data: string;
} | {
  type: "arraybuffer";
  data: ArrayBuffer;
}
export type TypedFiles = Record<string, TypedFile>
export interface AppData {
  entrypoint: string;
  files: TypedFiles;
  requirements: string[];
}

/**
 * To reduce the string length after JSON.stringify(),
 * use single-length character as the map keys.
 */
export const ALIAS_TYPE = "t"
export const ALIAS_DATA = "d"
export const ALIAS_BYTELENGTH = "l"
export type LZStringCompressableFile = {
  /**
   * type
   */
  [ALIAS_TYPE]: "text";
  /**
   * data
   */
  [ALIAS_DATA]: string;
} | {
  /**
   * type
   */
  [ALIAS_TYPE]: "arraybuffer",
  /**
   * data
   */
  [ALIAS_DATA]: string,
  /**
   * byteLength
   */
  [ALIAS_BYTELENGTH]: number,
}
export type LZStringCompressableFiles = Record<string, LZStringCompressableFile>
export interface LZStringCompressableAppData extends Omit<AppData, "files"> {
  files: LZStringCompressableFiles;
}
