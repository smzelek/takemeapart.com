const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'app.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/public'
    },
  },
  module: {
    rules: [
        { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']} 
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  mode: 'development',
  devtool: 'inline-source-map',
};

module.exports = config;