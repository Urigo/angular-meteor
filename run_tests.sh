#!/bin/sh
gulp 'build'
cd tests
rm -rf node_modules/angular2-meteor
ln -s ../.. node_modules/angular2-meteor
meteor test --driver-package=avital:mocha
