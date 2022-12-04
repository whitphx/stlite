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
        // For the Wasm code. Ref: https://chromestatus.com/feature/5499765773041664, https://github.com/WebAssembly/content-security-policy/issues/7
        "script-src 'wasm-unsafe-eval'",
        // style-src is necessary because of emotion. In dev, style-loader with injectType=styleTag is also the reason.
        "style-src 'self' 'unsafe-inline'",
        // The worker is inlined as blob: https://github.com/whitphx/stlite/blob/v0.7.1/packages/stlite-kernel/src/kernel.ts#L16
        "worker-src blob:",
        // For <script /> tag permissions.
        // - 'self': The main scripts
        // - 'unsafe-inline': Allow the inline scripts from custom components
        // - *: Custom components may load arbitrary third party scripts from the Internet.
        "script-src-elem 'self' 'unsafe-inline' *",
        // For stylesheets.
        // - 'self': For the stylesheet files bundled with the core.
        // - 'unsafe-inline': The core frontend uses some inline stylesheets.
        // - *: Custom components may load arbitrary remote stylesheets, e.g. streamlit_folium.
        "style-src-elem 'self' 'unsafe-inline' *",
        // - 'self': For font files bundled with Streamlit core, for example, for `st.latex()`.
        // - data: Some custom components load fonts through `data:` scheme, e.g. streamlit_aggrid.
        "font-src 'self' data:",
        // For loading external resources.
        // - `cspSourceForMap`:  The hosted Pyodide files, wheels, and some remote resources
        // - *: Allow fetch() and XMLHttpRequest to load any resources (*).
        isEnvProduction && `connect-src ${cspSourceForMap} 'self' *`,
        isEnvDevelopment &&
          `connect-src ${cspSourceForMap} https://cdn.jsdelivr.net/ https://pypi.org/ https://files.pythonhosted.org/ http://localhost:3000/ ws://localhost:3000/ *`,
        // Allow <img> to load any resources. blob: is necessary for st.pyplot, data: is for st.map
        "img-src * blob: data:",
        // Allow <audio> and <video> to load any resources
        "media-src * blob:",
        // For iframe sources.
        // `st.video()` creates an iframe for a YouTube video loading resources from https://*.youtube.com.
        // In addition, custom components may create iframes loading arbitrary external resources (*).
        "frame-src *",
      ]
        .filter(Boolean)
        .join("; ");
      htmlWebpackPlugin.options.meta["Content-Security-Policy"] = {
        "http-equiv": "Content-Security-Policy",
        content: csp,
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
      // TODO: Enable when using Webpack 5.
      // webpackConfig.module.rules.push({
      //   test: /\.whl$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //     }
      //   ],
      //   type: 'javascript/auto'
      // })

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
