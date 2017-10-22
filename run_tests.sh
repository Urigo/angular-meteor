#!/bin/sh

# run 'meteor npm install' in the tests.

cd tests
cd angular-compilers-tests
meteor npm install
meteor npm test
cd ../../examples/angularcli-meteor
npm install
npm run meteor-client:bundle
npm run api:reset
export CHROME_BIN=chromium-browser
npm run test
concurrently "npm run start" "npm run api" "sleep 90; npm run e2e" --kill-others --success first