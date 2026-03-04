import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";

const kernel = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st
import datetime

st.title("IDBFS Persistent Storage")
st.write("Files written to \`/mnt\` persist across page reloads using IndexedDB.")

st.button("Rerun")

if st.button("Clear /mnt/log.txt"):
    with open("/mnt/log.txt", "w") as f:
        f.write("")

now = datetime.datetime.now()
with open("/mnt/log.txt", "a") as f:
    f.write(f"Visited at {now}\\n")

with open("/mnt/log.txt", "r") as f:
    content = f.read()

st.write("Contents of \`/mnt/log.txt\`:")
st.code(content)
`,
    },
  },
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
  wheelUrls,
  idbfsMountpoints: ["/mnt"],
});

export function App() {
  return <StliteAppWithToast kernel={kernel} />;
}
