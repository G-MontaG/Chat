'use strict';
const path = require('path');
const _ = require('lodash');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  cash: true,
  watch: true,
  context: path.join(__dirname, "/src"),
  entry: {
    vendors: "./vendors",
    main: "./main"
  },
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: "/",
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss-loader!resolve-url!sass?sourceMap')
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'url?name=imgs/[name].[ext]&limit=10000'
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[ext]',
        exclude: /\/src\/imgs\//
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      favicon: 'favicon.ico'
    }),
    new CleanWebpackPlugin(['./public']),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery'
    })
  ],
  postcss: function () {
    return {
      defaults: [autoprefixer({browsers: ['last 2 versions']})]
    };
  }
};