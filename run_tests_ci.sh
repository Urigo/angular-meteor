#!/bin/sh
cd tests/packages/meteor_tests_package
npm link ../../../
npm install
cd ../../
VELOCITY_TEST_PACKAGES=1 meteor test-packages --velocity ./packages/meteor_tests_package
rm -rf ./packages/meteor_tests_package/node_modules
