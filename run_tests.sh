#!/bin/sh

# run 'meteor npm install' in the tests.

cd tests
cd angular2-compilers-tests
meteor npm install
npm test
