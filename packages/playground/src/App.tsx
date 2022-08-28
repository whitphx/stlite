import { useState, useEffect, useCallback } from "react";
import "./App.css";

import EditorModal, { EditorFiles } from "./EditorModal";

import {
  StliteKernel,
  StliteKernelOptions,
  StliteKernelProvider,
} from "@stlite/stlite-kernel";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

const ENTRYPOINT = "streamlit_app.py";

const REQUIREMENTS_PATH = "requirements";

const DEFAULT_REQUIREMENTS = ["matplotlib", "hiplot"];

const DEFAULT_FILES: EditorFiles = {
  [ENTRYPOINT]: {
    language: "python",
    value: `### Sample code copied from https://docs.streamlit.io/library/api-reference/charts/st.pyplot ###
import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000)

arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)

### Sample code copied from https://facebookresearch.github.io/hiplot/tuto_streamlit.html ###
import json
import streamlit as st
import hiplot as hip

x1, x2, x3 = st.slider('x1'), st.slider('x2'), st.slider('x3')

# Create your experiment as usual
data = [{'uid': 'a', 'dropout': 0.1, 'lr': 0.001, 'loss': 10.0, 'optimizer': 'SGD', 'x': x1},
        {'uid': 'b', 'dropout': 0.15, 'lr': 0.01, 'loss': 3.5, 'optimizer': 'Adam', 'x': x2},
        {'uid': 'c', 'dropout': 0.3, 'lr': 0.1, 'loss': 4.5, 'optimizer': 'Adam', 'x': x3}]
xp = hip.Experiment.from_iterable(data)

# Instead of calling directly \`.display()\`
# just convert it to a streamlit component with \`.to_streamlit()\` before
ret_val = xp.to_streamlit(ret="selected_uids", key="hip").display()

st.markdown("hiplot returned " + json.dumps(ret_val))
`,
  },
  "pages/page_1.py": {
    language: "python",
    value: `import streamlit as st

st.write("Page1")`,
  },
  [REQUIREMENTS_PATH]: {
    language: "text",
    value: DEFAULT_REQUIREMENTS.join("\n"),
  },
};

const DEFAULT_KERNEL_FILES: StliteKernelOptions["files"] = {};
Object.keys(DEFAULT_FILES).forEach((key) => {
  if (key === REQUIREMENTS_PATH) {
    return;
  }

  DEFAULT_KERNEL_FILES[key] = {
    data: DEFAULT_FILES[key].value,
  };
});

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    const kernel = new StliteKernel({
      command: "run",
      entrypoint: ENTRYPOINT,
      requirements: DEFAULT_REQUIREMENTS,
      files: DEFAULT_KERNEL_FILES,
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
        defaultFiles={DEFAULT_FILES}
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
