module.exports = require('./common')({
  entry: {
    'packages/angular-meteor-data/angular-meteor': './src/angular-meteor'
  },
  output: {
    filename: '[name].js'
  }
});
