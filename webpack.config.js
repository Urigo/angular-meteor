var path = require('path');
var TransferWebpackPlugin = require('transfer-webpack-plugin');


module.exports = {
  entry: {
    'meteor_component': './modules/meteor_component.ts',
    'mongo_cursor_differ': './modules/mongo_cursor_differ.ts'
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  externals: [
    {
      'angular2/core': 'angular2/core',
      'angular2/src/core/change_detection/differs/default_iterable_differ': 'angular2/src/core/change_detection/differs/default_iterable_differ',
      'angular2/src/facade/async': 'angular2/src/facade/async'
    }
  ],
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};