// Based on streamlit/frontend/lib/src/RootStyleProvider.tsx

import React, { ReactElement, useMemo } from "react";
import createCache from "@emotion/cache";
import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
  ClassNames,
  Global,
} from "@emotion/react";

import { ThemeConfig } from "@streamlit/lib";
import { appStyles } from "./appStyles";
import { documentStyles } from "./documentStyles";
import { overlayPortalStyles } from "./overlayPortalStyles";
import { useUniqueId } from "./useUniqueId";

export interface RootStyleProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
  styleNonce?: string;
  disableDocumentStyles?: boolean;
}

export function RootStyleProvider(props: RootStyleProviderProps): ReactElement {
  const { children, theme, styleNonce, disableDocumentStyles } = props;

  const uniqueId = useUniqueId();

  const cache = useMemo(
    () =>
      createCache({
        key: `st-${uniqueId}`,
        ...(styleNonce && { nonce: styleNonce }),
      }),
    [uniqueId, styleNonce],
  );

  return (
    <CacheProvider value={cache}>
      <EmotionThemeProvider theme={theme.emotion}>
        {/*
          Mount the document-level styles (e.g. `html`, `body`) unless disabled.
          These styles are "global" in the traditional sense and may affect the host page.
         */}
        {!disableDocumentStyles && <Global styles={documentStyles} />}
        <Global styles={overlayPortalStyles(theme.emotion)} />
        <ClassNames>
          {({ css, cx }) => (
            <div
              className={cx(
                css(
                  // "appStyles" contains the styles that are applied to the app root.
                  // In the original Streamlit, these were "globalStyles" applied to the body,
                  // but in Stlite they are scoped to this root element to allow embedding.
                  appStyles(theme.emotion),
                ),
                "stlite-root",
              )}
            >
              {children}
            </div>
          )}
        </ClassNames>
      </EmotionThemeProvider>
    </CacheProvider>
  );
}
