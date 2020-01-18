const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    "client/client-bundle": "./client/index.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              disable: true
            }
          }
        ]
      }
    ]
  },

  externals: {uws: "uws"},

  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname + "/dist")
    //publicPath: './'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./client/src/index.html",
      filename: "./client/index.html"
    })
  ],
  devServer: {
    contentBase: "./dist",
    hot: true
  }
};
