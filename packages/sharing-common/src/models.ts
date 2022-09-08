export type TypedFile =
  | {
      type: "text";
      data: string;
    }
  | {
      type: "arraybuffer";
      data: ArrayBuffer;
    };
export type TypedFiles = Record<string, TypedFile>;
export interface AppData {
  entrypoint: string;
  files: TypedFiles;
  requirements: string[];
}

/**
 * To reduce the string length after JSON.stringify(),
 * use single-length characters as the map keys.
 */
export const K_TYPE = "t";
export const K_DATA = "d";
export const K_BYTELENGTH = "l";
export interface LZStringCompressableFileString {
  [K_TYPE]: "t"; // text
  [K_DATA]: string;
}
export interface LZStringCompressableFileArrayBuffer {
  [K_TYPE]: "a"; // arraybuffer
  [K_DATA]: string;
  [K_BYTELENGTH]: number;
}
export type LZStringCompressableFile =
  | LZStringCompressableFileString
  | LZStringCompressableFileArrayBuffer;
export type LZStringCompressableFiles = Record<
  string,
  LZStringCompressableFile
>;
export const K_ENTRYPOINT = "e";
export const K_FILES = "f";
export const K_REQUIREMENTS = "r";
export interface LZStringCompressableAppData {
  [K_ENTRYPOINT]: AppData["entrypoint"];
  [K_FILES]: LZStringCompressableFiles;
  [K_REQUIREMENTS]: AppData["requirements"];
}
