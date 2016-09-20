var _ = require('lodash');
var webpack = require('webpack');
var pkg = require('../package.json');
var path = require('path');

var common = {
  // the entry point for the bundle
  entry: {
    // output              // input
    'dist/angular-meteor': './src/angular-meteor'
  },
  output: {
    // point to root directory so we can avoid using ../../
    path: path.join(__dirname, '../'),
    library: 'angularMeteor',
    libraryTarget: 'umd'
  },
  target: 'web',
  // global variables
  externals: {
    angular: 'angular',
    jsondiffpatch: 'jsondiffpatch',
    underscore: {
      root: '_',
      amd: 'underscore',
      commonjs2: 'underscore',
      commonjs: 'underscore'
    },
    Meteor: 'Meteor',
    Package: 'Package',
    Tracker: 'Tracker'
  },
  // global configuration of babel loader
  babel: {
    presets: ['es2015'],
    plugins: ['add-module-exports']
  },
  eslint: {
    quiet: true,
    failOnError: true
  },
  module: {
    preLoaders: [{
      // linting check
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      // use babel on js files
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: [
    // add information about name and version of angular-meteor package
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version)
  ],
  resolve: {
    extensions: ['', '.js']
  }
};

// merge provided configuration with common things
module.exports = function(config) {
  return _.merge({}, common, config);
};
