import { describe, it, expect } from "vitest";
import { PromiseDelegate } from "./promise-delegate";

function awaitWithTimeout(
  promise: Promise<unknown>,
  timeout: number
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => reject(new Error(`Timed out after ${timeout}ms`)),
      timeout
    );
    promise.then(resolve, reject);
  });
}

describe("PromiseDelegate", () => {
  it("resolves the promise with the given value when .resolve() is called", async () => {
    const delegate = new PromiseDelegate<string>();
    expect(delegate.promise).toBeInstanceOf(Promise);
    await expect(awaitWithTimeout(delegate.promise, 10)).rejects.toThrow(
      "Timed out after 10ms"
    );
    delegate.resolve("value");
    await expect(delegate.promise).resolves.toBe("value");
  });

  it("rejects the promise with the given reason when .reject() is called", async () => {
    const delegate = new PromiseDelegate<string>();
    expect(delegate.promise).toBeInstanceOf(Promise);
    await expect(awaitWithTimeout(delegate.promise, 10)).rejects.toThrow(
      "Timed out after 10ms"
    );
    delegate.reject("reason");
    await expect(delegate.promise).rejects.toBe("reason");
  });
});
