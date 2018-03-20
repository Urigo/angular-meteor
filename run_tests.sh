#!/bin/sh

# run 'meteor npm install' in the tests.

export METEOR_PACKAGE_DIRS=../../../atmosphere-packages
export NODE_OPTIONS=--max-old-space-size=4096
cd examples/MeteorCLI/bare
npm ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../../angularcli-meteor
npm ci
npm run meteor-client:bundle
npm run api:reset
# Testing JIT
npm run test
# Testing AOT w/o Rollup
AOT=1 npm run test --production
# Testing AOT with Rollup
AOT=1 ROLLUP=1 npm run test --production
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
#concurrently "npm run start" "npm run api" "sleep 180; npm run e2e" --kill-others --success first
concurrently "npm run start" "sleep 30; npm run e2e" --kill-others --success first
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
