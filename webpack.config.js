const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, { mode }) => ({
  devtool: mode === "development" ? "cheap-eval-source-map" : "none",
  entry: path.resolve(__dirname, "src/index.ts"),
  externals: {
    react: "commonjs react",
    "react-dom": "commonjs react-dom"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  output: {
    filename: "index.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new CopyPlugin([{ from: "src/style.scss", to: "./" }])
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".json", "js", "jsx", ".scss"]
  },
  watch: mode === "development"
});
