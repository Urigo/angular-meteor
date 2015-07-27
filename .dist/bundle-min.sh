cd ../..
PARENT=$(pwd)
BUNDLER_TEMP="tmp-angular-meteor-bundler"

# Create temp meteor project
rm -rf $BUNDLER_TEMP
meteor create $BUNDLER_TEMP
cd $BUNDLER_TEMP

# Add local urigo:angular
PACKAGE_DIRS=$PARENT meteor add urigo:angular

# Build the packages for getting the dependencies
PACKAGE_DIRS=$PARENT meteor build --debug .
tar -zxf $BUNDLER_TEMP.tar.gz

OUTPUT_PATH="$PARENT/angular-meteor-bundler-output"
PACKAGES_PATH="$PARENT/$BUNDLER_TEMP/bundle/programs/web.browser/packages"

# Create output folder and copy the dependencies files
rm -rf $OUTPUT_PATH
mkdir $OUTPUT_PATH

cp "$PACKAGES_PATH/observe-sequence.js" $OUTPUT_PATH
cp "$PACKAGES_PATH/lai_collection-extensions.js" $OUTPUT_PATH
cp "$PACKAGES_PATH/dburles_mongo-collection-instances.js" $OUTPUT_PATH
cp "$PACKAGES_PATH/urigo_angular.js" $OUTPUT_PATH

cd $OUTPUT_PATH

cat observe-sequence.js >> angular-meteor.bundle.js
cat lai_collection-extensions.js >> angular-meteor.bundle.js
cat dburles_mongo-collection-instances.js >> angular-meteor.bundle.js
cat urigo_angular.js >> angular-meteor.bundle.js

curl -X POST -s --data-urlencode 'input@angular-meteor.bundle.js' http://javascript-minifier.com/raw > angular-meteor.bundle.min.js

cp angular-meteor.bundle.* ../angular-meteor/.dist

rm -rf "$PARENT/$BUNDLER_TEMP" # Cleanup the temp folder
rm -rf $OUTPUT_PATH # Cleanup the output folder
