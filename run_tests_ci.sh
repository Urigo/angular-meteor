VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter --velocity ./
cd examples/collectionfs
VELOCITY_CI=1 meteor --test
