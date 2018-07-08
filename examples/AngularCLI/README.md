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
ng new angular-cli-meteor --style scss
cd angular-cli-meteor
```

```
meteor create api
yarn add babel-runtime
yarn add meteor-node-stubs
yarn add meteor-rxjs
yarn add meteor-client-bundler --dev
yarn add @types/meteor --dev
rm -rf api/node_modules
rm -rf api/client
mv api/server/main.js api/server/main.ts
rm api/package.json api/yarn.lock
ln -s ../package.json api/package.json
ln -s ../yarn.lock api/yarn.lock
ln -s ../tsconfig.jsonapi/tsconfig.json
ln -s ../node_modules api/
cd api; meteor add barbatus:typescript; cd ..
```

Create `meteor-client.config.json`.
Add `"generateNodeModules": true` to `meteor-client.config.json`.
Add `node_modules/meteor-client.js` to `scripts` section in `angular.json`.
Add `meteor` to `types` section in `src/tsconfig.app.json`
