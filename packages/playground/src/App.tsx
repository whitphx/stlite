import { useState, useEffect, useCallback } from "react";
import "./App.css";

import EditorModal, { EditorFiles } from "./EditorModal";
import sampleAppFiles from "./sample_app";

import {
  StliteKernel,
  StliteKernelOptions,
  StliteKernelProvider,
} from "@stlite/stlite-kernel";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

const REQUIREMENTS_PATH = "requirements";

const DEFAULT_REQUIREMENTS = ["matplotlib", "hiplot"];

const SAMPLE_APP_EDITOR_FILES: EditorFiles = {};
Object.keys(sampleAppFiles).forEach((key) => {
  SAMPLE_APP_EDITOR_FILES[key] = {
    value: sampleAppFiles[key],
    language: "python",
  };
});

const DEFAULT_EDITOR_FILES: EditorFiles = {
  ...SAMPLE_APP_EDITOR_FILES,
  [REQUIREMENTS_PATH]: {
    language: "text",
    value: DEFAULT_REQUIREMENTS.join("\n"),
  },
};

const DEFAULT_KERNEL_FILES: StliteKernelOptions["files"] = {};
Object.keys(sampleAppFiles).forEach((key) => {
  DEFAULT_KERNEL_FILES[key] = {
    data: sampleAppFiles[key],
  };
});

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const kernel = new StliteKernel({
      command: "run",
      entrypoint: "Hello.py",
      requirements: DEFAULT_REQUIREMENTS,
      files: DEFAULT_KERNEL_FILES,
      basePath: __webpack_public_path__,
    });
    setKernel(kernel);

    return () => {
      kernel.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <EditorModal
        defaultFiles={DEFAULT_EDITOR_FILES}
        onFileChange={useCallback(
          (path: string, value: string) => {
            if (path === REQUIREMENTS_PATH) {
              const requirements = value
                .split("\n")
                .map((r) => r.trim())
                .filter((r) => r !== "");
              kernel?.install(requirements).then(() => {
                console.log("Installed");
              });
              return;
            }

            kernel?.writeFile(path, value);
          },
          [kernel]
        )}
      />
      {kernel && (
        <StliteKernelProvider kernel={kernel}>
          <StyletronProvider value={engine}>
            <ThemedApp />
          </StyletronProvider>
        </StliteKernelProvider>
      )}
    </>
  );
}

export default App;
