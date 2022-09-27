const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  webpack: {
    configure: (webpackConfig, { env: webpackEnv, paths}) => {
      // Set CSP following the best practice of Electron: https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy
      const htmlWebpackPlugin = webpackConfig.plugins.find((plugin) => plugin instanceof HtmlWebpackPlugin)
      // style-src is necessary because of emotion. In dev, style-loader with injectType=styleTag is also the reason.
      htmlWebpackPlugin.options.meta['Content-Security-Policy'] = { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src \'self\'; script-src \'self\' \'unsafe-eval\'; style-src \'unsafe-inline\'; worker-src blob:; script-src-elem \'self\' blob: https://cdn.jsdelivr.net/; connect-src https://cdn.jsdelivr.net/ https://pypi.org/ https://files.pythonhosted.org/ http://localhost:3000/ ws://localhost:3000/' }

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
        "src": path.resolve(__dirname, "../../streamlit/frontend/src")
      }

      /* To build Streamlit. These configs are copied from streamlit/frontend/craco.config.js */
      // Apache Arrow uses .mjs
      webpackConfig.module.rules.push({
        include: /node_modules/,
        test: /\.mjs$/,
        type: "javascript/auto",
      })

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
    }
  }
}
