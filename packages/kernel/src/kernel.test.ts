import { StliteKernel } from "./kernel";
import StliteWorker from "./worker?worker";
import { beforeAll, expect, suite, test } from "vitest";
import { getWheelUrls, pyodideUrl } from "./test-utils";

suite(
  "StliteKernel.runPython",
  {
    timeout: 60 * 1000,
  },
  async () => {
    let kernel: StliteKernel;

    beforeAll(async () => {
      const worker = new StliteWorker();

      // XXX: Patching `@vitest/web-worker`'s Worker.postMessage() to set `ports` properly.

      // Replacement of https://github.com/vitest-dev/vitest/blob/73b54ce2859d34f3847de465efb3f6affda0f8c1/packages/web-worker/src/utils.ts#L21
      // that is called from https://github.com/vitest-dev/vitest/blob/73b54ce2859d34f3847de465efb3f6affda0f8c1/packages/web-worker/src/utils.ts#L62
      function createClonedMessageEvent(
        data: unknown,
        transferOrOptions:
          | StructuredSerializeOptions
          | Transferable[]
          | undefined,
      ) {
        const transfer = Array.isArray(transferOrOptions)
          ? transferOrOptions
          : transferOrOptions?.transfer;
        return new MessageEvent("message", {
          // data: structuredClone(data, { transfer }),
          data,
          origin,
          ports: (transfer ?? []).filter((t) => t instanceof MessagePort),
        });
      }

      // Patching https://github.com/vitest-dev/vitest/blob/73b54ce2859d34f3847de465efb3f6affda0f8c1/packages/web-worker/src/worker.ts#L163
      function overridePostMessage(
        this: any, // eslint-disable-line @typescript-eslint/no-explicit-any
        data: unknown,
        transferOrOptions:
          | StructuredSerializeOptions
          | Transferable[]
          | undefined,
      ) {
        if (this._vw_messageQueue != null) {
          this._vw_messageQueue.push([data, transferOrOptions]);
          return;
        }

        const event = createClonedMessageEvent(data, transferOrOptions);
        this._vw_workerTarget.dispatchEvent(event);
      }
      worker.postMessage = overridePostMessage.bind(worker);

      kernel = new StliteKernel({
        worker,
        pyodideUrl,
        wheelUrls: getWheelUrls(),
        entrypoint: "app.py",
        files: {
          "app.py": {
            data: `
import streamlit as st

st.write("Hello, stlite!")
st.write(123)
`,
          },
        },
        requirements: [],
        prebuiltPackageNames: [],
        archives: [],
      });
    });

    test("kernel.runPython() executes Python code and returns the result", async () => {
      const result = await kernel.runPython("1 + 2");
      expect(result).toBe(3);
    });

    test("kernel.runPython() can use installed packages", async () => {
      await kernel.install(["pytz==2025.2"]);
      const result = await kernel.runPython(`
import pytz
pytz.__version__
      `);
      expect(result).toBe("2025.2");
    });
  },
);
