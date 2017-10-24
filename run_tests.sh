#!/bin/sh

# run 'meteor npm install' in the tests.

export METEOR_PACKAGE_DIRS=../../atmosphere-packages
cd tests
cd angular-compilers-tests
meteor npm install
meteor npm test
