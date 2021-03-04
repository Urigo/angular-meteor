#!/bin/sh
export NODE_OPTIONS=--max-old-space-size=2048
export METEOR_PACKAGE_DIRS=../../atmosphere-packages
echo "[MeteorCLI - angularjs] Resetting project"
meteor reset
echo "[MeteorCLI - angularjs] Installing npm dependencies"
npm ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - angularjs] Installing meteor dependencies"
meteor update --all-packages --allow-incompatible-update
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - angularjs] Testing Dev"
npm run test:ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - angularjs] Testing Production"
meteor build ./.meteor/build
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi