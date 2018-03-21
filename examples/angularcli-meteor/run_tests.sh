#!/bin/sh
npm ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
npm run meteor-client:bundle
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
npm run api:reset
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
npm run test
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
#concurrently "npm run start" "npm run api" "sleep 180; npm run e2e" --kill-others --success first
concurrently "npm run start" "sleep 30; npm run e2e" --kill-others --success first
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi