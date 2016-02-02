#!/bin/sh
cd tests
VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package=velocity:html-reporter ./packages/meteor_tests_package