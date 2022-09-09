/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface AppData {
  entrypoint: string;
  files: { [key: string]: File };
  requirements: string[];
}

export interface AppData_FilesEntry {
  key: string;
  value: File | undefined;
}

export interface File {
  content?: { $case: "text"; text: string } | { $case: "data"; data: Uint8Array };
}

function createBaseAppData(): AppData {
  return { entrypoint: "", files: {}, requirements: [] };
}

export const AppData = {
  encode(message: AppData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.entrypoint !== "") {
      writer.uint32(10).string(message.entrypoint);
    }
    Object.entries(message.files).forEach(([key, value]) => {
      AppData_FilesEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    for (const v of message.requirements) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entrypoint = reader.string();
          break;
        case 2:
          const entry2 = AppData_FilesEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.files[entry2.key] = entry2.value;
          }
          break;
        case 3:
          message.requirements.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AppData {
    return {
      entrypoint: isSet(object.entrypoint) ? String(object.entrypoint) : "",
      files: isObject(object.files)
        ? Object.entries(object.files).reduce<{ [key: string]: File }>((acc, [key, value]) => {
          acc[key] = File.fromJSON(value);
          return acc;
        }, {})
        : {},
      requirements: Array.isArray(object?.requirements) ? object.requirements.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: AppData): unknown {
    const obj: any = {};
    message.entrypoint !== undefined && (obj.entrypoint = message.entrypoint);
    obj.files = {};
    if (message.files) {
      Object.entries(message.files).forEach(([k, v]) => {
        obj.files[k] = File.toJSON(v);
      });
    }
    if (message.requirements) {
      obj.requirements = message.requirements.map((e) => e);
    } else {
      obj.requirements = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AppData>, I>>(object: I): AppData {
    const message = createBaseAppData();
    message.entrypoint = object.entrypoint ?? "";
    message.files = Object.entries(object.files ?? {}).reduce<{ [key: string]: File }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = File.fromPartial(value);
      }
      return acc;
    }, {});
    message.requirements = object.requirements?.map((e) => e) || [];
    return message;
  },
};

function createBaseAppData_FilesEntry(): AppData_FilesEntry {
  return { key: "", value: undefined };
}

export const AppData_FilesEntry = {
  encode(message: AppData_FilesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      File.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppData_FilesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAppData_FilesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = File.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AppData_FilesEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? File.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: AppData_FilesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? File.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AppData_FilesEntry>, I>>(object: I): AppData_FilesEntry {
    const message = createBaseAppData_FilesEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null) ? File.fromPartial(object.value) : undefined;
    return message;
  },
};

function createBaseFile(): File {
  return { content: undefined };
}

export const File = {
  encode(message: File, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.content?.$case === "text") {
      writer.uint32(10).string(message.content.text);
    }
    if (message.content?.$case === "data") {
      writer.uint32(18).bytes(message.content.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): File {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.content = { $case: "text", text: reader.string() };
          break;
        case 2:
          message.content = { $case: "data", data: reader.bytes() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): File {
    return {
      content: isSet(object.text)
        ? { $case: "text", text: String(object.text) }
        : isSet(object.data)
        ? { $case: "data", data: bytesFromBase64(object.data) }
        : undefined,
    };
  },

  toJSON(message: File): unknown {
    const obj: any = {};
    message.content?.$case === "text" && (obj.text = message.content?.text);
    message.content?.$case === "data" &&
      (obj.data = message.content?.data !== undefined ? base64FromBytes(message.content?.data) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<File>, I>>(object: I): File {
    const message = createBaseFile();
    if (object.content?.$case === "text" && object.content?.text !== undefined && object.content?.text !== null) {
      message.content = { $case: "text", text: object.content.text };
    }
    if (object.content?.$case === "data" && object.content?.data !== undefined && object.content?.data !== null) {
      message.content = { $case: "data", data: object.content.data };
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
