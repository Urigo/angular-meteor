#!/bin/sh

# run 'meteor npm install' in the tests.

cd tests/angular2-compiler-tests
meteor npm install
meteor test --driver-package=sonja:jasmine
