var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './app',
  output: {
    filename: 'build.js',
    libraryTarget: 'umd',
    library: 'ReactProxy'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: __dirname }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
