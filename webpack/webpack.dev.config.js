const path = require('path');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './dist';

module.exports = {
  mode: 'development',
  output: {
    filename: 'widget.js',
    path: path.resolve(bundleOutputDir),
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    inline: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(),
    new copyWebpackPlugin([{ from: 'demo/' }]),
  ],
};
