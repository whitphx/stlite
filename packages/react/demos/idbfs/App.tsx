import { StliteAppWithToast, createKernel } from "@stlite/react";
import { wheelUrls } from "@stlite/react/vite-utils";

const kernel = createKernel({
  entrypoint: "app.py",
  files: {
    "app.py": {
      data: `
import streamlit as st

st.title("IDBFS Persistent Storage")
st.write("Data written to \`/mnt\` persists across page reloads using IndexedDB.")

try:
    with open("/mnt/counter.txt", "r") as f:
        count = int(f.read())
except (FileNotFoundError, ValueError):
    count = 0

count += 1

with open("/mnt/counter.txt", "w") as f:
    f.write(str(count))

st.write(f"Visit count: {count}")

if st.button("Reset counter"):
    with open("/mnt/counter.txt", "w") as f:
        f.write("0")
    st.rerun()
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
