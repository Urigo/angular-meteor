#!/bin/sh
npm install -g tsd
cd tests/packages/meteor_tests_package
npm install
VELOCITY_TEST_PACKAGES=1 meteor test-packages --velocity ./