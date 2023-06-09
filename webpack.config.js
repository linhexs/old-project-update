const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    compress: true,
    port: 8000,
    hot: true,
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif)$/i,
        type: "asset",
        parser: {
          // 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中。
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        // 输出目录
        generator: {
          filename: "images/[name].[hash:6][ext]",
        },
      },
      {
        test: /\.ejs/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  optimization: {
    minimize: true, //代码压缩
    minimizer: [new UglifyJsPlugin(), new CssMinimizerPlugin()],
    splitChunks: {
      minSize: 5 * 1024,
      chunks: "all",
      name: "common",
      automaticNameDelimiter: "_",
      cacheGroups: {
        jquery: {
          name: "jquery",
          chunks: "all",
          test: /jquery\.js/,
        },
        lodash: {
          name: "lodash",
          chunks: "all",
          test: /lodash/,
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].chunk.css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "./src/login.html",
      chunks: ["login"],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/img"),
          to: path.resolve(__dirname, "./dist/img"),
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};
