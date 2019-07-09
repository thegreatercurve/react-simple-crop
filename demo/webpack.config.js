const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    hot: true,
    open: true,
    port: 3000
  },
  entry: path.resolve(__dirname, "index.jsx"),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "babel-loader",
        test: /\.jsx?$/
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "index.html")
    })
  ],
  resolve: {
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-simple-crop": path.resolve(__dirname, "../dist")
    }
  }
};
