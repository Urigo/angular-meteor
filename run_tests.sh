#!/bin/sh
# renaming node_modules is required,
# otherwise Meteor throws errors.
mv -f .node_modules node_modules
gulp 'build'
mv -f node_modules .node_modules
cd tests
linklocal
meteor test --driver-package=avital:mocha
