// Based on streamlit/frontend/lib/src/RootStyleProvider.tsx

import React, { ReactElement } from "react"
import createCache from "@emotion/cache"
import {
  CacheProvider,
  ThemeProvider as EmotionThemeProvider,
  ClassNames,
} from "@emotion/react"

import { BaseProvider } from "baseui"
import { ThemeConfig } from "@streamlit/lib"
import { globalStyles } from "./globalStyles"

export interface RootStyleProviderProps {
  theme: ThemeConfig
  children: React.ReactNode
}

const nonce = document.currentScript?.nonce || ""
const cache = createCache({
  // The key field is required but only matters if there's more than one
  // emotion cache in use. This will probably never be true for us, so we just
  // set it arbitrarily.
  key: "st-emotion-cache",
  ...(nonce && { nonce }),
})

export function RootStyleProvider(
  props: RootStyleProviderProps
): ReactElement {
  const { children, theme } = props

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
              <div className={cx(css(globalStyles(theme.emotion)), "stlite-root")}>
                {children}
              </div>
            )}
          </ClassNames>
        </EmotionThemeProvider>
      </CacheProvider>
    </BaseProvider>
  )
}
