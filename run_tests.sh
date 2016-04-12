#!/bin/sh
cd tests
gulp 'build'
ln -s ../.. node_modules/angular2-meteor
meteor test --driver-package=avital:mocha
