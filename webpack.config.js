'use strict';

module.exports = {
  entry: "./src/app/main.ts",
  output: {
    path: './public',
    filename: "main.js"
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
};