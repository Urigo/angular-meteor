# AngularcliMeteor

## Meteor server

Run `meteor` from the `api` directory to start the Meteor server.

## Bundling Meteor client

`meteor-client-bundler` is a module bundler which will take a bunch of Atmosphere package and put them into a single module, so we can load Meteor's client scripts regardless of what framework we're using to run our server.

Run `./node_modules/.bin/meteor-client bundle -s api`.

## Development server

Then run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm run build-prod` for a production build with AOT.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## The process I've done to recreate this

```
ng new angularcli-meteor --style scss
cd angularcli-meteor
ng eject
```
We need to eject `webpack.config.js` to be able to patch it to support Meteor.

```
cat patches/webpack.config.js.patch | patch -p1
cat patches/tsconfig.json.patch | patch -p1
cat patches/tsconfig.app.json.patch | patch -p1
cat patches/tsconfig.spec.json.patch | patch -p1
cat patches/tsconfig.e2e.json.patch | patch -p1
```

```
npm install --save-dev typescript-extends
npm install --save moment
npm install --save angular2-moment
```

```
meteor create api --release 1.6-rc.13
npm install --save babel-runtime
npm install --save meteor-node-stubs
npm install --save meteor-rxjs
npm install --save-dev meteor-client-bundler
npm install --save-dev @types/meteor
npm install --save-dev tmp
rm -rf api/node_modules
rm -rf api/client
mv api/server/main.js api/server/main.ts
rm api/package.json api/package-lock.json
ln -s ../package.json api/package.json
ln -s ../package-lock.json api/package-lock.json
ln -s ../node_modules api/
cd api; meteor add barbatus:typescript; cd ..
```

Now we need to create `api/tsconfig.json`.

To get the AOT config we will need to eject `webpack.config.js` once again, this time with the `--prod` flag.  
To be able to do so we will first have to remove all the "run" scripts from package.json.

```
mv webpack.config.js webpack.config.js.dev
ng eject --prod
cat patches/webpack.config.js.prod.patch | patch -p1
mv webpack.config.js webpack.config.js.prod
ln -s webpack.config.js.dev webpack.config.js
```

Finally let's add `start-prod` and `build-prod` to the "run" scripts from package.json.
