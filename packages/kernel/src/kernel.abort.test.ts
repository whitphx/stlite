import { StliteKernel } from "./kernel";
import StliteWorker from "./worker?worker";
import { beforeAll, expect, suite, test } from "vitest";
import { getWheelUrls, pyodideUrl } from "./test-utils";

suite(
  "StliteKernel.sendHttpRequest with AbortSignal",
  {
    timeout: 60 * 1000,
  },
  async () => {
    let kernel: StliteKernel;

    beforeAll(async () => {
      const worker = new StliteWorker();

      kernel = new StliteKernel({
        worker,
        pyodideUrl,
        wheelUrls: getWheelUrls(),
        entrypoint: "app.py",
        files: {
          "app.py": {
            data: "",
          },
        },
        requirements: [],
        prebuiltPackageNames: [],
        archives: [],
      });
      await kernel.loaded;
    });

    test("kernel.sendHttpRequest() should be aborted by AbortSignal", async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      const promise = kernel.sendHttpRequest(
        {
          method: "GET",
          path: "/healthz",
          headers: {},
          body: "",
        },
        signal,
      );

      controller.abort();

      await expect(promise).rejects.toThrow(/Aborted/);
    });
  },
);
