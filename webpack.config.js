'use strict';

module.exports = {
  entry: {
    main: "./src/app/main.ts",
    vendor: "./src/app/vendor.ts"
  },
  output: {
    path: __dirname + '/public/js',
    filename: "[name].js",
    library: "[name]"
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