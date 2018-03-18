#!/bin/sh

# run 'meteor npm install' in the tests.

export METEOR_PACKAGE_DIRS=../../../atmosphere-packages
cd examples/MeteorCLI/bare
rm -rf node_modules
meteor npm install
NODE_OPTIONS="--max-old-space-size=4096" meteor npm run test:ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../../angularcli-meteor
npm install
npm run meteor-client:bundle
npm run api:reset
npm run test
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
#concurrently "npm run start" "npm run api" "sleep 180; npm run e2e" --kill-others --success first
concurrently "npm run start" "sleep 30; npm run e2e" --kill-others --success first
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
