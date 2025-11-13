class t {
  /**
   * Create a clone of this UploadFileInfo with the given status.
   */
  setStatus(s) {
    return new t(this.name, this.size, this.id, s);
  }
  constructor(s, i, e, h) {
    this.name = s, this.size = i, this.id = e, this.status = h;
  }
}
export {
  t as U
};
//# sourceMappingURL=UploadFileInfo-B5SttewO.js.map
