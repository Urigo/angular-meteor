# Run this script from home folder

# configs variables
NAME=angular-meteor-auth # Set the bundle file name
PACKAGE=angular-meteor-auth
DIST_FOLDER=dist # The folder that the bundled files will be copy in to

# run time variables
PROJECT_ROOT=$(pwd)
DIST_PATH=$PROJECT_ROOT/$DIST_FOLDER
BUNDLER_TEMP="tmp-$NAME-bundler"
BUNDLER_PATH=$DIST_PATH/$BUNDLER_TEMP
# Ansure that the dist folder exists
mkdir -p $DIST_PATH

# Create temp meteor project
rm -rf $BUNDLER_PATH
meteor create $BUNDLER_PATH
cd $BUNDLER_PATH

# Add packages
echo > .meteor/packages # Delete all default packages
PACKAGE_DIRS="$PROJECT_ROOT/packages" meteor add $PACKAGE

# Build the packages
PACKAGE_DIRS=$PROJECT_ROOT/packages meteor build --debug .
tar -zxf $BUNDLER_TEMP.tar.gz

OUTPUT_PATH="$DIST_PATH/$NAME-bundler-output"
PACKAGES_PATH="$DIST_PATH/$BUNDLER_TEMP/bundle/programs/web.browser/packages"

# Create output folder and copy the dependencies files
rm -rf $OUTPUT_PATH
mkdir $OUTPUT_PATH

ls $PACKAGES_PATH

cat "$PACKAGES_PATH/angular-meteor-auth.js" >> $OUTPUT_PATH/$NAME.bundle.js

# Minify
cd $PROJECT_ROOT
npm install uglify-js
./node_modules/.bin/uglifyjs $OUTPUT_PATH/$NAME.bundle.js -o $OUTPUT_PATH/$NAME.bundle.min.js

# Copy the bundled files to the dist folder
cp $OUTPUT_PATH/$NAME.bundle.* $DIST_PATH

# Cleanup
rm -rf $BUNDLER_PATH $OUTPUT_PATH
