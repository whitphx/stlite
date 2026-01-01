// Based on streamlit/frontend/app/src/ThemedApp.tsx

import FontFaceDeclaration from "@streamlit/app/src/components/FontFaceDeclaration";

import FontSources from "@streamlit/app/src/components/FontSources";
import { PortalProvider, WindowDimensionsProvider } from "@streamlit/lib";

import AppWithScreencast from "@streamlit/app/src/App";

import { useThemeManager } from "@streamlit/app/src/util/useThemeManager";
import { RootStyleProvider } from "./StliteRootStyleProvider";

export interface ThemedAppProps {
  streamlitExecutionStartedAt: number;
}

const ThemedApp = ({
  streamlitExecutionStartedAt,
}: ThemedAppProps): JSX.Element => {
  const [themeManager, fontFaces, fontSources] = useThemeManager();
  const { activeTheme } = themeManager;

  return (
    <RootStyleProvider theme={activeTheme}>
      <WindowDimensionsProvider>
        {/* The data grid requires one root level portal element for rendering cell overlays */}
        <PortalProvider>
          {fontFaces.length > 0 && (
            <FontFaceDeclaration fontFaces={fontFaces} />
          )}
          {fontSources && <FontSources fontSources={fontSources} />}
          <AppWithScreencast
            theme={themeManager}
            streamlitExecutionStartedAt={streamlitExecutionStartedAt}
          />
        </PortalProvider>
      </WindowDimensionsProvider>
    </RootStyleProvider>
  );
};

export default ThemedApp;
