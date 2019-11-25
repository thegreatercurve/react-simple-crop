const path = require("path");

const webpackConfig = require("../webpack.config.js");

const PROJECT_SOURCE = path.resolve(__dirname, "../src");

const customProdWebpackConfig = webpackConfig(null, { mode: "production" });

module.exports = ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...customProdWebpackConfig.module.rules.slice(0, -1),
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    ...config.resolve,
    extensions: [
      ...config.resolve.extensions,
      ...customProdWebpackConfig.resolve.extensions
    ],
    modules: [...config.resolve.modules, PROJECT_SOURCE]
  }
});
