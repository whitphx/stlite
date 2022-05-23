import React, { useMemo, useContext } from "react";
import { StliteKernel } from "../kernel";

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
      "useStliteKernel() must be inside <StliteKernelProvider />"
    );
  }

  return value.kernel;
}
