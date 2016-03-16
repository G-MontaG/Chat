'use strict';
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: path.join(__dirname, "/src"),
  entry: {
    polyfills: "./polyfills",
    vendors: "./vendors",
    main: "./main"
  },
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: "/",
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    alias: {
      'bootstrap': 'bootstrap.js'
    }
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules(\/|\\)rxjs/ }
    ],
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' },
      { test: /\.(scss|sass|css)$/, loader: ExtractTextPlugin.extract('css!postcss-loader!resolve-url!sass?sourceMap') },
      { test: /\.(png|jpg|svg)$/, loader: 'url?name=[path][name].[ext]&limit=10000' },
      { test: /\.(ttf|eot|woff|woff2)$/, loader: 'file?name=[path][name].[ext]' }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(['./public'])
  ],
  postcss: function () {
    return {
      defaults: [autoprefixer({ browsers: ['last 2 versions'] })]
    };
  }
};