#!/bin/sh

# run 'meteor npm install' in the tests.

cd tests
linklocal
meteor test --driver-package=practicalmeteor:mocha
meteor test --full-app --once --driver-package=practicalmeteor:mocha
