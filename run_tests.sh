#!/bin/sh

# run 'meteor npm install' in the tests.

cd tests
cd angular-compilers-tests
meteor npm install
meteor npm test
