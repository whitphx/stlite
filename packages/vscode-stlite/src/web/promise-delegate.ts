type PromiseImplFn<T> = ConstructorParameters<typeof Promise<T>>[0];

export class PromiseDelegate<T> {
  public readonly promise: Promise<T>;
  private resolveInternal!: Parameters<PromiseImplFn<T>>[0];
  private rejectInternal!: Parameters<PromiseImplFn<T>>[1];

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveInternal = resolve;
      this.rejectInternal = reject;
    });
  }

  public resolve(value: T): void {
    this.resolveInternal(value);
  }

  public reject(reason: unknown): void {
    this.rejectInternal(reason);
  }
}
