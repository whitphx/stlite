export type EncodableFile = {
  type: "text";
  data: string;
} | {
  type: "uint8array";
  data: Uint8Array;
}
export type EncodableFiles = Record<string, EncodableFile>

export interface EncodableAppData {
  entrypoint: string;
  files: EncodableFiles;
  requirements: string[];
}
