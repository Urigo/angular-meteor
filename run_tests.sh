#!/bin/sh
# renaming node_modules is required,
# otherwise Meteor throws errors.
mv -f .node_modules node_modules
gulp 'build'
mv -f node_modules .node_modules
cd tests
linklocal
meteor add avital:mocha
meteor test --driver-package=avital:mocha

# There is an issue which fails full-app integration tests
# for Angular 2 component when using Mocha driver.
# Another way is to uncomment below to use sanjo:jasmine.

# meteor add sanjo:jasmine
# meteor add velocity:html-reporter
# meteor remove avital:mocha
# meteor test --full-app --driver-package sanjo:jasmine
