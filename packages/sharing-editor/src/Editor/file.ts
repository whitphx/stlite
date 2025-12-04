export function readArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target?.result;
      if (!(buf instanceof ArrayBuffer)) {
        console.warn(`Loaded file in an unexpected type: ${typeof buf}`);
        return;
      }

      resolve(buf);
    };
    reader.readAsArrayBuffer(file);
  });
}

export function basename(path: string): string | undefined {
  const parts = path.split("/");
  if (parts.length === 0) {
    return undefined;
  }
  return parts[parts.length - 1];
}
