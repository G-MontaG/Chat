'use strict';

module.exports = {
  entry: {
    main: "./src/app/main.ts",
    vendor: "./src/app/vendor.ts"
  },
  output: {
    path: __dirname + '/public/js',
    publicPath: "/js/",
    filename: "[name].js"
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
  },
  devtool: "source-map"
};