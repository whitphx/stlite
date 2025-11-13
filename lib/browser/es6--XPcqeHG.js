const _ = globalThis.showDirectoryPicker;
async function I(a = {}) {
  if (_ && !a._preferPolyfill)
    return _(a);
  const e = document.createElement("input");
  e.type = "file", e.webkitdirectory = !0, e.multiple = !0, e.style.position = "fixed", e.style.top = "-100000px", e.style.left = "-100000px", document.body.appendChild(e);
  const t = Promise.resolve().then(() => M);
  return await new Promise((i) => {
    e.addEventListener("change", i), e.click();
  }), t.then((i) => i.getDirHandlesFromInput(e));
}
const N = { accepts: [] }, j = globalThis.showOpenFilePicker;
async function W(a = {}) {
  const e = { ...N, ...a };
  if (j && !a._preferPolyfill)
    return j(e);
  const t = document.createElement("input");
  t.type = "file", t.multiple = e.multiple, t.accept = (e.accepts || []).map(
    (n) => [
      ...(n.extensions || []).map((s) => "." + s),
      ...n.mimeTypes || []
    ]
  ).flat().join(","), Object.assign(t.style, {
    position: "fixed",
    top: "-100000px",
    left: "-100000px"
  }), document.body.appendChild(t);
  const i = Promise.resolve().then(() => M);
  return await new Promise((n) => {
    t.addEventListener("change", n, { once: !0 }), t.click();
  }), t.remove(), i.then((n) => n.getFileHandlesFromInput(t));
}
const A = globalThis.showSaveFilePicker;
async function L(a = {}) {
  if (A && !a._preferPolyfill)
    return A(a);
  a._name && (console.warn("deprecated _name, spec now have `suggestedName`"), a.suggestedName = a._name);
  const { FileSystemFileHandle: e } = await Promise.resolve().then(() => b), { FileHandle: t } = await import("./downloader-DcCTL3Wz.js");
  return new e(new t(a.suggestedName));
}
globalThis.DataTransferItem && !DataTransferItem.prototype.getAsFileSystemHandle && (DataTransferItem.prototype.getAsFileSystemHandle = async function() {
  const a = this.webkitGetAsEntry(), [
    { FileHandle: e, FolderHandle: t },
    { FileSystemDirectoryHandle: i },
    { FileSystemFileHandle: n }
  ] = await Promise.all([
    import("./sandbox-ChAzL-i-.js"),
    Promise.resolve().then(() => T),
    Promise.resolve().then(() => b)
  ]);
  return a.isFile ? new n(new e(a, !1)) : new i(new t(a, !1));
});
async function q(a, e = {}) {
  if (!a)
    return globalThis.navigator?.storage?.getDirectory() || globalThis.getOriginPrivateDirectory();
  const { FileSystemDirectoryHandle: t } = await Promise.resolve().then(() => T), i = await a, n = await (i.default ? i.default(e) : i(e));
  return new t(n);
}
const $ = {
  WritableStream: globalThis.WritableStream,
  TransformStream: globalThis.TransformStream,
  DOMException: globalThis.DOMException,
  Blob: globalThis.Blob,
  File: globalThis.File
}, { WritableStream: z } = $;
class p extends z {
  #e;
  constructor(e) {
    super(e), this.#e = e, Object.setPrototypeOf(this, p.prototype), this._closed = !1;
  }
  async close() {
    this._closed = !0;
    const e = this.getWriter(), t = e.close();
    return e.releaseLock(), t;
  }
  /** @param {number} position */
  seek(e) {
    return this.write({ type: "seek", position: e });
  }
  /** @param {number} size */
  truncate(e) {
    return this.write({ type: "truncate", size: e });
  }
  // The write(data) method steps are:
  write(e) {
    if (this._closed)
      return Promise.reject(new TypeError("Cannot write to a CLOSED writable stream"));
    const t = this.getWriter(), i = t.write(e);
    return t.releaseLock(), i;
  }
}
Object.defineProperty(p.prototype, Symbol.toStringTag, {
  value: "FileSystemWritableFileStream",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
Object.defineProperties(p.prototype, {
  close: { enumerable: !0 },
  seek: { enumerable: !0 },
  truncate: { enumerable: !0 },
  write: { enumerable: !0 }
});
globalThis.FileSystemFileHandle && !globalThis.FileSystemFileHandle.prototype.createWritable && !globalThis.FileSystemWritableFileStream && (globalThis.FileSystemWritableFileStream = p);
const d = Symbol("adapter");
class v {
  /** @type {FileSystemHandle} */
  [d];
  /** @type {string} */
  name;
  /** @type {('file'|'directory')} */
  kind;
  /** @param {FileSystemHandle & {writable}} adapter */
  constructor(e) {
    this.kind = e.kind, this.name = e.name, this[d] = e;
  }
  /** @param {FileSystemHandlePermissionDescriptor} descriptor */
  async queryPermission(e = {}) {
    const { mode: t = "read" } = e, i = this[d];
    if (i.queryPermission)
      return i.queryPermission({ mode: t });
    if (t === "read")
      return "granted";
    if (t === "readwrite")
      return i.writable ? "granted" : "denied";
    throw new TypeError(`Mode ${t} must be 'read' or 'readwrite'`);
  }
  async requestPermission({ mode: e = "read" } = {}) {
    const t = this[d];
    if (t.requestPermission)
      return t.requestPermission({ mode: e });
    if (e === "read")
      return "granted";
    if (e === "readwrite")
      return t.writable ? "granted" : "denied";
    throw new TypeError(`Mode ${e} must be 'read' or 'readwrite'`);
  }
  /**
   * Attempts to remove the entry represented by handle from the underlying file system.
   *
   * @param {object} options
   * @param {boolean} [options.recursive=false]
   */
  async remove(e = {}) {
    await this[d].remove(e);
  }
  /**
   * @param {FileSystemHandle} other
   */
  async isSameEntry(e) {
    return this === e ? !0 : !e || typeof e != "object" || this.kind !== e.kind || !e[d] ? !1 : this[d].isSameEntry(e[d]);
  }
}
Object.defineProperty(v.prototype, Symbol.toStringTag, {
  value: "FileSystemHandle",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
globalThis.FileSystemHandle && (globalThis.FileSystemHandle.prototype.queryPermission ??= function(a) {
  return "granted";
});
const x = {
  INVALID: ["seeking position failed.", "InvalidStateError"],
  GONE: ["A requested file or directory could not be found at the time an operation was processed.", "NotFoundError"],
  MISMATCH: ["The path supplied exists, but was not an entry of requested type.", "TypeMismatchError"],
  MOD_ERR: ["The object can not be modified in this way.", "InvalidModificationError"],
  SYNTAX: (a) => [`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${a}`, "SyntaxError"],
  SECURITY: ["It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources.", "SecurityError"],
  DISALLOWED: ["The request is not allowed by the user agent or the platform in the current context.", "NotAllowedError"]
}, U = {
  writable: globalThis.WritableStream
};
async function R(a) {
  console.warn("deprecated fromDataTransfer - use `dt.items[0].getAsFileSystemHandle()` instead");
  const [e, t, i] = await Promise.all([
    import("./memory-B3L1Fctl.js"),
    import("./sandbox-ChAzL-i-.js"),
    Promise.resolve().then(() => T)
  ]), n = new e.FolderHandle("", !1);
  return n._entries = a.map(
    (s) => s.isFile ? new t.FileHandle(s, !1) : new t.FolderHandle(s, !1)
  ), new i.FileSystemDirectoryHandle(n);
}
async function k(a) {
  const { FolderHandle: e, FileHandle: t } = await import("./memory-B3L1Fctl.js"), { FileSystemDirectoryHandle: i } = await Promise.resolve().then(() => T), n = Array.from(a.files), s = n[0].webkitRelativePath.split("/", 1)[0], o = new e(s, !1);
  return n.forEach((y) => {
    const l = y.webkitRelativePath.split("/");
    l.shift();
    const c = l.pop(), f = l.reduce((w, u) => (w._entries[u] || (w._entries[u] = new e(u, !1)), w._entries[u]), o);
    f._entries[c] = new t(y.name, y, !1);
  }), new i(o);
}
async function C(a) {
  const { FileHandle: e } = await import("./memory-B3L1Fctl.js"), { FileSystemFileHandle: t } = await Promise.resolve().then(() => b);
  return Array.from(a.files).map(
    (i) => new t(new e(i.name, i, !1))
  );
}
const M = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  config: U,
  errors: x,
  fromDataTransfer: R,
  getDirHandlesFromInput: k,
  getFileHandlesFromInput: C
}, Symbol.toStringTag, { value: "Module" })), { GONE: B, MOD_ERR: G } = x, m = Symbol("adapter");
let h = class E extends v {
  /** @type {FileSystemDirectoryHandle} */
  [m];
  constructor(e) {
    super(e), this[m] = e;
  }
  /**
   * @param {string} name Name of the directory
   * @param {object} [options]
   * @param {boolean} [options.create] create the directory if don't exist
   * @returns {Promise<FileSystemDirectoryHandle>}
   */
  async getDirectoryHandle(e, t = {}) {
    if (e === "")
      throw new TypeError("Name can't be an empty string.");
    if (e === "." || e === ".." || e.includes("/"))
      throw new TypeError("Name contains invalid characters.");
    t.create = !!t.create;
    const i = await this[m].getDirectoryHandle(e, t);
    return new E(i);
  }
  /** @returns {AsyncGenerator<[string, FileSystemHandle | FileSystemDirectoryHandle]>} */
  async *entries() {
    const { FileSystemFileHandle: e } = await Promise.resolve().then(() => b);
    for await (const [t, i] of this[m].entries())
      yield [i.name, i.kind === "file" ? new e(i) : new E(i)];
  }
  /** @deprecated use .entries() instead */
  async *getEntries() {
    const { FileSystemFileHandle: e } = await Promise.resolve().then(() => b);
    console.warn("deprecated, use .entries() instead");
    for await (let t of this[m].entries())
      yield t.kind === "file" ? new e(t) : new E(t);
  }
  /**
   * @param {string} name Name of the file
   * @param {object} [options]
   * @param {boolean} [options.create] create the file if don't exist
   */
  async getFileHandle(e, t = {}) {
    const { FileSystemFileHandle: i } = await Promise.resolve().then(() => b);
    if (e === "") throw new TypeError("Name can't be an empty string.");
    if (e === "." || e === ".." || e.includes("/"))
      throw new TypeError("Name contains invalid characters.");
    t.create = !!t.create;
    const n = await this[m].getFileHandle(e, t);
    return new i(n);
  }
  /**
   * @param {string} name
   * @param {object} [options]
   * @param {boolean} [options.recursive]
   */
  async removeEntry(e, t = {}) {
    if (e === "")
      throw new TypeError("Name can't be an empty string.");
    if (e === "." || e === ".." || e.includes("/"))
      throw new TypeError("Name contains invalid characters.");
    return t.recursive = !!t.recursive, this[m].removeEntry(e, t);
  }
  async resolve(e) {
    if (await e.isSameEntry(this))
      return [];
    const t = [{ handle: this, path: [] }];
    for (; t.length; ) {
      let { handle: i, path: n } = t.pop();
      for await (const s of i.values()) {
        if (await s.isSameEntry(e))
          return [...n, s.name];
        s.kind === "directory" && t.push({ handle: s, path: [...n, s.name] });
      }
    }
    return null;
  }
  async *keys() {
    for await (const [e] of this[m].entries())
      yield e;
  }
  async *values() {
    for await (const [e, t] of this)
      yield t;
  }
  [Symbol.asyncIterator]() {
    return this.entries();
  }
};
Object.defineProperty(h.prototype, Symbol.toStringTag, {
  value: "FileSystemDirectoryHandle",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
Object.defineProperties(h.prototype, {
  getDirectoryHandle: { enumerable: !0 },
  entries: { enumerable: !0 },
  getFileHandle: { enumerable: !0 },
  removeEntry: { enumerable: !0 }
});
if (globalThis.FileSystemDirectoryHandle) {
  const a = globalThis.FileSystemDirectoryHandle.prototype;
  a.resolve = async function(s) {
    if (await s.isSameEntry(this))
      return [];
    const o = [{ handle: this, path: [] }];
    for (; o.length; ) {
      let { handle: y, path: l } = o.pop();
      for await (const c of y.values()) {
        if (await c.isSameEntry(s))
          return [...l, c.name];
        c.kind === "directory" && o.push({ handle: c, path: [...l, c.name] });
      }
    }
    return null;
  };
  async function e(n) {
    if (await (await navigator.storage.getDirectory()).resolve(n) === null)
      throw new DOMException(...B);
  }
  const t = a.entries;
  a.entries = async function* () {
    await e(this), yield* t.call(this);
  }, a[Symbol.asyncIterator] = async function* () {
    yield* this.entries();
  };
  const i = a.removeEntry;
  a.removeEntry = async function(n, s = {}) {
    return i.call(this, n, s).catch(async (o) => {
      throw o instanceof DOMException && o.name === "UnknownError" && !s.recursive && !(await t.call(this).next()).done ? new DOMException(...G) : o;
    });
  };
}
const T = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileSystemDirectoryHandle: h,
  default: h
}, Symbol.toStringTag, { value: "Module" })), { INVALID: V, SYNTAX: O, GONE: Y } = x, H = Symbol("adapter");
class S extends v {
  /** @type {FileSystemFileHandle} */
  [H];
  constructor(e) {
    super(e), this[H] = e;
  }
  /**
   * @param  {Object} [options={}]
   * @param  {boolean} [options.keepExistingData]
   * @returns {Promise<FileSystemWritableFileStream>}
   */
  async createWritable(e = {}) {
    return new p(
      await this[H].createWritable(e)
    );
  }
  /**
   * @returns {Promise<File>}
   */
  async getFile() {
    return this[H].getFile();
  }
}
Object.defineProperty(S.prototype, Symbol.toStringTag, {
  value: "FileSystemFileHandle",
  writable: !1,
  enumerable: !1,
  configurable: !0
});
Object.defineProperties(S.prototype, {
  createWritable: { enumerable: !0 },
  getFile: { enumerable: !0 }
});
if (globalThis.FileSystemFileHandle && !globalThis.FileSystemFileHandle.prototype.createWritable) {
  const a = /* @__PURE__ */ new WeakMap();
  let e;
  const t = () => {
    let n, s;
    onmessage = async (o) => {
      const y = o.ports[0], l = o.data;
      switch (l.type) {
        case "open":
          const c = l.name;
          let f = await navigator.storage.getDirectory();
          for (const w of l.path)
            f = await f.getDirectoryHandle(w);
          n = await f.getFileHandle(c), s = await n.createSyncAccessHandle();
          break;
        case "write":
          s.write(l.data, { at: l.position }), s.flush();
          break;
        case "truncate":
          s.truncate(l.size);
          break;
        case "abort":
        case "close":
          s.close();
          break;
      }
      y.postMessage(0);
    };
  };
  globalThis.FileSystemFileHandle.prototype.createWritable = async function(n) {
    if (!e) {
      const r = `(${t.toString()})()`, F = new Blob([r], {
        type: "text/javascript"
      });
      e = URL.createObjectURL(F);
    }
    const s = new Worker(e, { type: "module" });
    let o = 0;
    const y = new TextEncoder();
    let l = await this.getFile().then((r) => r.size);
    const c = (r) => new Promise((F, P) => {
      const g = new MessageChannel();
      g.port1.onmessage = (D) => {
        D.data instanceof Error ? P(D.data) : F(D.data), g.port1.close(), g.port2.close(), g.port1.onmessage = null;
      }, s.postMessage(r, [g.port2]);
    }), f = await navigator.storage.getDirectory(), w = await a.get(this), u = await f.resolve(w);
    if (u === null) throw new DOMException(...Y);
    return await c({ type: "open", path: u, name: this.name }), n?.keepExistingData === !1 && (await c({ type: "truncate", size: 0 }), l = 0), new p({
      start: (r) => {
      },
      async write(r) {
        if (r?.constructor === Object ? r = { ...r } : r = { type: "write", data: r, position: o }, r.type === "write") {
          if (!("data" in r))
            throw await c({ type: "close" }), new DOMException(...O("write requires a data argument"));
          if (r.position ??= o, typeof r.data == "string")
            r.data = y.encode(r.data);
          else if (r.data instanceof ArrayBuffer)
            r.data = new Uint8Array(r.data);
          else if (!(r.data instanceof Uint8Array) && ArrayBuffer.isView(r.data))
            r.data = new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength);
          else if (!(r.data instanceof Uint8Array)) {
            const P = await new Response(r.data).arrayBuffer();
            r.data = new Uint8Array(P);
          }
          Number.isInteger(r.position) && r.position >= 0 && (o = r.position), o += r.data.byteLength, l += r.data.byteLength;
        } else if (r.type === "seek")
          if (Number.isInteger(r.position) && r.position >= 0) {
            if (l < r.position)
              throw new DOMException(...V);
            console.log("seeking", r), o = r.position;
            return;
          } else
            throw await c({ type: "close" }), new DOMException(...O("seek requires a position argument"));
        else if (r.type === "truncate")
          if (Number.isInteger(r.size) && r.size >= 0)
            l = r.size, o > l && (o = l);
          else
            throw await c({ type: "close" }), new DOMException(...O("truncate requires a size argument"));
        await c(r);
      },
      async close() {
        await c({ type: "close" }), s.terminate();
      },
      async abort(r) {
        await c({ type: "abort", reason: r }), s.terminate();
      }
    });
  };
  const i = FileSystemDirectoryHandle.prototype.getFileHandle;
  FileSystemDirectoryHandle.prototype.getFileHandle = async function(...n) {
    const s = await i.call(this, ...n);
    return a.set(s, this), s;
  };
}
const b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileSystemFileHandle: S,
  default: S
}, Symbol.toStringTag, { value: "Module" })), J = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileSystemDirectoryHandle: h,
  FileSystemFileHandle: S,
  FileSystemHandle: v,
  FileSystemWritableFileStream: p,
  getOriginPrivateDirectory: q,
  showDirectoryPicker: I,
  showOpenFilePicker: W,
  showSaveFilePicker: L
}, Symbol.toStringTag, { value: "Module" }));
export {
  J as a,
  $ as c,
  x as e
};
//# sourceMappingURL=es6--XPcqeHG.js.map
