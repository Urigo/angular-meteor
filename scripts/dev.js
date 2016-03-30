#!/usr/bin/env node
var replace = require('replace-in-file');
var fs = require('fs');

function wrapInQuotes(file) {
  return '\'' + file + '\'';
}

// look up for --stop flag
var isStop = process.argv.slice(2).indexOf('--stop') !== -1;

// path to angular-meteor-data package
var path = 'packages/angular-meteor-data/';
// package definition
var packageFile = path + 'package.js';
// angular-meteor file
var npmFile = '.npm/package/node_modules/angular-meteor/dist/angular-meteor.js';
var devFile = 'angular-meteor.js';

// replace options
var options = {
  files: packageFile,
  replace: wrapInQuotes(isStop ? devFile : npmFile),
  with: wrapInQuotes(isStop ? npmFile : devFile)
};

// clean up first
try {
  if (fs.accessSync(path + devFile, fs.F_OK)) {
    fs.unlinkSync(path + devFile);
  }
} catch(e) {}

// make sure package uses proper file
replace(options);
