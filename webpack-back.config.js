const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    "server-bundle": "./app.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname + "/dist"),
    publicPath: "/"
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
    fs: "empty"
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/config\.js$/),
    new CopyPlugin([
      { from: "./server/config.json", to: "./config.json" },
      { from: "./rfidApi", to: "./rfidApi" }
    ])
    //new webpack.IgnorePlugin(/uws/)
  ]
};
