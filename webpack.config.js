var path = require('path');

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
  externals: [
    {
      // We ignore the same file we compile so we wont get circular dependency
      // We also do not want to bundle them one inside the other
      './cursor_handle': './cursor_handle',
      './mongo_cursor_differ': './mongo_cursor_differ',
      './meteor_component': './meteor_component',
      './mongo_cursor_observer': './mongo_cursor_observer',
      // Angular files from the source code will be available from the NPM package
      // No need to bundle them inside
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