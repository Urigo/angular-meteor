#!/bin/sh

# run 'meteor npm install' in the tests.

export METEOR_PACKAGE_DIRS=../../../atmosphere-packages
export NODE_OPTIONS=--max-old-space-size=4096
cd examples/MeteorCLI/bare
npm ci
# Testing JIT
npm run test:jit
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
# Testing JIT
npm run test:aot
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
# Testing JIT
npm run test:aot:rollup
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
cd ../../angularcli-meteor
npm ci
npm run meteor-client:bundle
npm run api:reset
npm run test
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
#concurrently "npm run start" "npm run api" "sleep 180; npm run e2e" --kill-others --success first
concurrently "npm run start" "sleep 30; npm run e2e" --kill-others --success first
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
