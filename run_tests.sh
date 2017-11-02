#!/bin/sh

# run 'meteor npm install' in the tests.

export METEOR_PACKAGE_DIRS=../../atmosphere-packages
cd tests
cd angular-compilers-tests
rm -rf node_modules
meteor npm install
meteor npm run test:ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../../examples/angularcli-meteor
npm install
npm run meteor-client:bundle
npm run api:reset
export CHROME_BIN=chromium-browser
npm run test
concurrently "npm run start" "npm run api" "sleep 90; npm run e2e" --kill-others --success first
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
