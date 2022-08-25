import React from "react";

import { StliteKernel, StliteKernelProvider } from "@stlite/stlite-kernel";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import weakMemoize from "@emotion/weak-memoize";

// Create a scoped Emotion styling. See https://github.com/emotion-js/emotion/issues/760#issuecomment-404353706
const memoizedCreateCacheWithContainer = weakMemoize(
  (container: HTMLElement) => {
    let newCache = createCache({ container, key: "stlite" });
    return newCache;
  }
);

// The Styletron client object must be memoized too.
const memoizedEngine = weakMemoize((container: HTMLElement) => {
  return new Styletron({ prefix: "st-", container });
});

export interface AppProps {
  kernel: StliteKernel;
  cssContainer: HTMLElement;
}
function StliteApp(props: AppProps) {
  const engine = memoizedEngine(props.cssContainer);
  return (
    // <CacheProvider /> to create a scoped Emotion
    <CacheProvider value={memoizedCreateCacheWithContainer(props.cssContainer)}>
      <StliteKernelProvider kernel={props.kernel}>
        <StyletronProvider value={engine}>
          <ThemedApp />
        </StyletronProvider>
      </StliteKernelProvider>
    </CacheProvider>
  );
}

export default StliteApp;
