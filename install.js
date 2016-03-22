var fs = require('fs.extra');

fs.copyRecursive('./build', './', function(err) {});
