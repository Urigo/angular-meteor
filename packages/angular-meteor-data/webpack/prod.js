module.exports = require('./common')({
  output: {
    // add .min suffix
    filename: '[name].min.js'
  },
  // add source map
  devtool: 'source-map'
});
