#!/bin/sh
(cd examples/MeteorCLI && ./run_tests.sh)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
(cd examples/angularjs && npm run test:ci)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
(cd examples/angularcli-meteor && ./run_tests.sh)
exit_code=$?; if [ ${exit_code} -gt 0 ]; then exit ${exit_code}; fi
