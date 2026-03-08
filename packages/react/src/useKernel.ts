import { useEffect, useState } from "react";
import type { StliteKernelOptions } from "@stlite/kernel";
import { createKernel } from "./kernel";
import type { StliteKernel } from "@stlite/kernel";

/**
 * Creates a {@link StliteKernel} tied to the React component lifecycle.
 *
 * The kernel is created inside an effect and disposed automatically when the
 * component unmounts. Returns `null` until the kernel is ready.
 *
 * **Important:** `options` is only read on mount.  Changing `options` on
 * subsequent renders has no effect – the kernel is *not* re-created.
 */
export function useKernel(options: StliteKernelOptions): StliteKernel | null {
  const [kernel, setKernel] = useState<StliteKernel | null>(null);

  useEffect(() => {
    const kernel = createKernel(options);
    setKernel(kernel);
    return () => {
      kernel.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is intentionally read only on mount.
  }, []);

  return kernel;
}
