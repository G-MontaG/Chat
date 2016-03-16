'use strict';
const path = require('path');

module.exports = {
  entry: {
    polyfills: "./src/app/polyfills.ts",
    vendors: "./src/app/vendors.ts",
    main: "./src/app/main.ts"
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    publicPath: "/js/",
    filename: "[name].js"
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules(\/|\\)rxjs/ }
    ],
    loaders: [
      // .ts files for TypeScript
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  }
};