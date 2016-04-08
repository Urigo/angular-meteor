var path = require('path');
var ExternalsPlugin = require('webpack-externals-plugin');

module.exports = {
  entry: {
    'meteor_component': './modules/meteor_component.ts',
    'mongo_cursor_differ': './modules/mongo_cursor_differ.ts',
    'mongo_cursor_observer': './modules/mongo_cursor_observer.ts',
    'cursor_handle': './modules/cursor_handle.ts',
    'index': './modules/index.ts'
  },
  output: {
    // We use CommonJS because of Meteor 1.3 specification that uses it
    libraryTarget: 'commonjs',
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  plugins: [
    new ExternalsPlugin({
      type: 'commonjs',
      include: __dirname + '/node_modules',
    })
  ],
  externals: [
    {
      // We ignore the same file we compile so we wont get circular dependency
      // We also do not want to bundle them one inside the other
      './cursor_handle': './cursor_handle',
      './mongo_cursor_differ': './mongo_cursor_differ',
      './meteor_component': './meteor_component',
      './mongo_cursor_observer': './mongo_cursor_observer'
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