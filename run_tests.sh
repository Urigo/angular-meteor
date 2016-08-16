#!/bin/sh
# renaming node_modules is required,
# otherwise Meteor throws errors.
mv -f .node_modules node_modules
npm run build
mv -f node_modules .node_modules
cd tests
#meteor npm install
linklocal
meteor add practicalmeteor:mocha
meteor test --driver-package=practicalmeteor:mocha
meteor test --full-app --once --driver-package=practicalmeteor:mocha
