#!/bin/sh
echo "[MeteorCLI - universal] Resetting project"
meteor reset
echo "[MeteorCLI - universal] Installing npm dependencies"
npm ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - universal] Installing meteor dependencies"
meteor update --all-packages --allow-incompatible-update
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - universal] Testing JIT"
npm run test:ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - universal] Testing AOT"
AOT=1 meteor build ./.meteor/build-aot
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - universal] AOT w/ Rollup"
AOT=1 ROLLUP=1 meteor build ./.meteor/build-aot-rollup
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi