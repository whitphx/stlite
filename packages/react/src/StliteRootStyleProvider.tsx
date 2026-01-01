// Based on streamlit/frontend/lib/src/RootStyleProvider.tsx

import React, { ReactElement, useId } from "react";
import createCache from "@emotion/cache";
import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
  ClassNames,
} from "@emotion/react";

import { BaseProvider } from "baseui";
import { ThemeConfig } from "@streamlit/lib";
import { globalStyles } from "./globalStyles";

export interface RootStyleProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
  styleNonce?: string;
}

export function RootStyleProvider(props: RootStyleProviderProps): ReactElement {
  const { children, theme, styleNonce } = props;

  const uniqueId = useId();

  const cache = createCache({
    key: `st-emotion-cache-${uniqueId}`,
    ...(styleNonce && { nonce: styleNonce }),
  });

  return (
    <BaseProvider
      theme={theme.basewebTheme}
      // This zIndex is required for modals/dialog. However,
      // it would be good to do some investigation
      // and find a better way to configure the zIndex
      // for the modals/dialogs.
      zIndex={theme.emotion.zIndices.popup}
    >
      <CacheProvider value={cache}>
        <EmotionThemeProvider theme={theme.emotion}>
          <ClassNames>
            {({ css, cx }) => (
              <div
                className={cx(css(globalStyles(theme.emotion)), "stlite-root")}
              >
                {children}
              </div>
            )}
          </ClassNames>
        </EmotionThemeProvider>
      </CacheProvider>
    </BaseProvider>
  );
}
