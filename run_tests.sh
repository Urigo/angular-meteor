#!/bin/sh
cd tests/packages/meteor_tests_package
npm link ../../../
npm install
cd ../../
VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package=velocity:html-reporter ./packages/meteor_tests_package
rm -rf node_modules