import React, { useMemo, useContext } from "react";
import type { StliteKernel } from "../kernel";

export interface StliteKernelContextValue {
  kernel: StliteKernel;
}
export const StliteKernelContext = React.createContext<
  StliteKernelContextValue | undefined
>(undefined);
const Provider = StliteKernelContext.Provider;

export interface StliteKernelProviderProps {
  kernel: StliteKernel;
  children: React.ReactNode;
}
export function StliteKernelProvider(props: StliteKernelProviderProps) {
  const { children, kernel } = props;

  const value = useMemo(() => {
    return {
      kernel,
    };
  }, [kernel]);

  return <Provider value={value}>{children}</Provider>;
}

export function useStliteKernel(): StliteKernel {
  const value = useContext(StliteKernelContext);
  if (value == null) {
    throw new Error(
      "useStliteKernel() must be inside <StliteKernelProvider />",
    );
  }

  return value.kernel;
}

/**
 * The kernel if this tree is mounted under `<StliteKernelProvider />`, else
 * null. A null kernel means the app is server-backed (e.g. the Cloudflare
 * Workers frontend): callers fall back to upstream Streamlit behavior and
 * leave URLs, downloads, and component iframes to the real HTTP server.
 */
export function useStliteKernelIfAvailable(): StliteKernel | null {
  return useContext(StliteKernelContext)?.kernel ?? null;
}
