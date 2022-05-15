module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
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
            loader: 'file-loader',
          }
        ],
        type: 'javascript/auto'
      })
      return webpackConfig;
    }
  }
}
