#!/bin/sh
cd tests
gulp 'pre-publish'
ln -s ../.. node_modules/angular2-meteor
meteor test --driver-package=avital:mocha
