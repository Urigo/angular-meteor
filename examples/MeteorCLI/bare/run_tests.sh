#!/bin/sh
echo "[MeteorCLI - bare] Resetting project"
meteor reset
echo "[MeteorCLI - bare] Installing npm dependencies"
npm ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - bare] Installing meteor dependencies"
meteor update --all-packages --allow-incompatible-update
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - bare] Testing JIT"
npm run test:ci
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - bare] Testing AOT"
AOT=1 meteor build ./.meteor/build-aot
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
echo "[MeteorCLI - bare] AOT w/ Rollup"
AOT=1 ROLLUP=1 meteor build ./.meteor/build-aot-rollup
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi