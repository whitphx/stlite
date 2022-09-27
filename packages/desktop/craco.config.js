const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  webpack: {
    configure: (webpackConfig, { env: webpackEnv, paths}) => {
      const isEnvDevelopment = webpackEnv === 'development';
      const isEnvProduction = webpackEnv === 'production';

      // Set CSP following the best practice of Electron: https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy
      const htmlWebpackPlugin = webpackConfig.plugins.find((plugin) => plugin instanceof HtmlWebpackPlugin)
      if (isEnvDevelopment) {
        // For dev env, CRA uses style-loader with injectType=styleTag, so allow inline styling.
        htmlWebpackPlugin.options.meta['Content-Security-Policy'] = { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src \'self\'; script-src \'self\'; style-src \'unsafe-inline\'' }
      }
      if (isEnvProduction) {
        htmlWebpackPlugin.options.meta['Content-Security-Policy'] = { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src \'self\'; script-src \'self\';' }
      }
      return webpackConfig;
    }
  }
}
