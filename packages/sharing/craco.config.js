const path = require("path");

module.exports = {
  babel: {
    plugins: ["@emotion"],
    loaderOptions: {
      cacheDirectory: true,
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
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
};
