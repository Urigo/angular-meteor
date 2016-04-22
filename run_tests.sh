#!/bin/sh
gulp 'build'
cd tests
ln -s ../.. node_modules/angular2-meteor
meteor test --driver-package=avital:mocha
