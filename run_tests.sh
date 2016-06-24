#!/bin/sh
# renaming node_modules is required,
# otherwise Meteor throws errors.
mv -f .node_modules node_modules
npm run build
mv -f node_modules .node_modules
cd tests
linklocal
meteor add practicalmeteor:mocha
meteor test --driver-package=practicalmeteor:mocha
