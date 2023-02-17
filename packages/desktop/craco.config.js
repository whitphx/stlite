const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  babel: {
    plugins: ["@emotion"],
    loaderOptions: {
      cacheDirectory: true,
    },
  },
  webpack: {
    configure: (webpackConfig, { env: webpackEnv, paths }) => {
      const isEnvDevelopment = webpackEnv === "development";
      const isEnvProduction = webpackEnv === "production";

      // Set CSP following the best practice of Electron: https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy
      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof HtmlWebpackPlugin
      );

      const cspSourceForMap =
        "https://data.streamlit.io/ https://*.mapbox.com/";
      const csp = [
        "default-src 'self'",
        // - 'wasm-unsafe-eval': For the Wasm code. Ref: https://chromestatus.com/feature/5499765773041664, https://github.com/WebAssembly/content-security-policy/issues/7
        // - 'unsafe-eval': For some components such as st.*_chart() or custom components such as streamlit_hiplot. Electron shows a warning about it, but we have to use this policy...
        "script-src 'wasm-unsafe-eval' 'unsafe-eval'",
        // style-src is necessary because of emotion. In dev, style-loader with injectType=styleTag is also the reason.
        "style-src 'self' 'unsafe-inline'",
        // - 'self': The stlite kernel worker is bundled as a separate file via Webpack 5's worker feature.
        // - blob: : Some third party libraries such as Mapbox used in st.map() create workers from blob.
        "worker-src 'self' blob:",
        // For <script /> tag permissions.
        // - 'self': The main scripts
        // - 'unsafe-inline': Allow the inline scripts from custom components
        // - https: : Custom components may load arbitrary third party scripts from the Internet. We only allow HTTPS for a security sake.
        "script-src-elem 'self' 'unsafe-inline' https:",
        // For stylesheets.
        // - 'self': For the stylesheet files bundled with the core.
        // - 'unsafe-inline': The core frontend uses some inline stylesheets.
        // - https: : Custom components may load arbitrary remote stylesheets, e.g. streamlit_folium.
        "style-src-elem 'self' 'unsafe-inline' https:",
        // - 'self': For font files bundled with Streamlit core, for example, for `st.latex()`.
        // - data: : Some custom components load fonts through `data:` scheme, e.g. streamlit_aggrid.
        // - https: : Some custom components load fonts from remote via HTTPS, e.g. streamlit_folium.
        "font-src 'self' data: https:",
        // For loading external resources.
        // - `cspSourceForMap`:  The hosted Pyodide files, wheels, and some remote resources
        // - https: : Allow fetch() and XMLHttpRequest to load any resources via HTTPS.
        isEnvProduction && `connect-src ${cspSourceForMap} 'self' https:`,
        isEnvDevelopment &&
          `connect-src ${cspSourceForMap} https://cdn.jsdelivr.net/ https://pypi.org/ https://files.pythonhosted.org/ http://localhost:3000/ ws://localhost:3000/ https:`,
        // Allow <img> to load any resources.
        // - blob: : For st.pyplot
        // - data: : For st.map
        // - file: : For some built-in image files such as the loading GIF animation and images for st.balloon(). TODO: We wanted to restrict the
        "img-src https: blob: data: file:",
        // Allow <audio> and <video> to load any resources.
        "media-src https: blob:",
        // For iframe sources.
        // `st.video()` creates an iframe for a YouTube video loading resources from https://*.youtube.com.
        // In addition, custom components may create iframes loading arbitrary external resources. We allow only HTTPS for a security sake..
        "frame-src https:",
      ]
        .filter(Boolean)
        .join("; ");
      htmlWebpackPlugin.userOptions.meta = {
        "Content-Security-Policy": {
          "http-equiv": "Content-Security-Policy",
          content: csp,
        },
      };

      // Let Babel compile outside of src/.
      // Ref: https://muguku.medium.com/fix-go-to-definition-and-hot-reload-in-a-react-typescript-monorepo-362908716d0e
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      const tsRule = oneOfRule.oneOf.find((rule) =>
        rule.test.toString().includes("ts|tsx")
      );
      tsRule.include = undefined;
      tsRule.exclude = /node_modules/;

      /* To resolve the alias streamlit/frontend uses */
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        src: path.resolve(__dirname, "../../streamlit/frontend/src"),
      };

      /* To build Streamlit. These configs are copied from streamlit/frontend/craco.config.js */
      webpackConfig.resolve.mainFields = ["module", "main"];
      // Webpack 5 requires polyfills. We don't need them, so resolve to an empty module
      webpackConfig.resolve.fallback ||= {};
      webpackConfig.resolve.fallback.tty = false;
      webpackConfig.resolve.fallback.os = false;

      // Apache Arrow uses .mjs
      webpackConfig.module.rules.push({
        include: /node_modules/,
        test: /\.mjs$/,
        type: "javascript/auto",
      });

      /* For file-loader that resolves the wheels */
      // Since Webpack5, Asset Modules has been introduced to cover what file-loader had done.
      // However, in this project, we use the inline loader setting like `import * from "!!file-loader!/path/to/file"` to use file-loader
      // but it does not turn off Asset Modules and leads to duplicate assets generated.
      // To make matters worse, the actually resolved paths from such import statements point to the URL from Asset Modules, not the file-loader specified with the inline syntax,
      // then we don't obtain the expected result.
      // So we turn off Asset Modules here by setting `type: 'javascript/auto'`.
      // See https://webpack.js.org/guides/asset-modules/
      webpackConfig.module.rules.push({
        test: /\.whl$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
        type: "javascript/auto",
      });

      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      jestConfig.roots = [...jestConfig.roots, "<rootDir>/electron"];
      jestConfig.collectCoverageFrom = [
        ...jestConfig.collectCoverageFrom,
        "electron/**/*.{js,jsx,ts,tsx}",
        "!electron/**/*.d.ts",
      ];
      jestConfig.testMatch = [
        ...jestConfig.testMatch,
        "<rootDir>/electron/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/electron/**/*.{spec,test}.{js,jsx,ts,tsx}",
      ];
      return jestConfig;
    },
  },
};
