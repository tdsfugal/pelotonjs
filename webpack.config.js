var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './peloton.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'peloton.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: /src/
    }]
  }
  //devtool: 'eval-source-map',
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false,
  //     },
  //     output: {
  //       comments: false,
  //     },
  //   }),
  // ]
}
