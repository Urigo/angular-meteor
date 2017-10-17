# AngularcliMeteor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.7.

## Meteor server

Run `meteor` from the `api` directory to start the Meteor server.

## Development server

Then run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm run build-prod` for a production build with AOT.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Recreate this example from scratch

```
ng new angularcli-meteor --style scss
cd angularcli-meteor
ng eject
cat webpack.config.js.patch | patch -p1
cat tsconfig.json.patch | patch -p1
Create src/declarations.d.ts
cat src/tsconfig.app.json.patch | patch -p1
cat src/tsconfig.spec.json.patch | patch -p1
cat e2e/tsconfig.e2e.json.patch | patch -p1
npm install --save-dev typescript-extends
npm install --save moment
npm install --save angular2-moment
meteor create api --release 1.6-rc.13 && rm -rf api/node_modules
rm -rf api/client
rm api/package.json api/package-lock.json; ln -s ../package.json api/package.json; ln -s ../package-lock.json api/package-lock.json
ln -s ../node_modules api/
cd api; meteor add barbatus:typescript; cd ..
Create api/tsconfig.json
mv api/server/main.js api/server/main.ts
ln -s ../src/declarations.d.ts api/
npm install --save babel-runtime
npm install --save meteor-node-stubs
npm install --save meteor-rxjs
npm install --save-dev @types/meteor
npm install --save-dev tmp
Initialize client app
Initialize Meteor backend
Removed scripts from package.json to be able to eject
mv webpack.config.js webpack.config.js.dev
ng eject --prod
Use relative paths in webpack.config.js
cat webpack.config.js.prod.patch | patch -p1
mv webpack.config.js webpack.config.js.prod
ln -s webpack.config.js.dev webpack.config.js
Add start-prod and build-prod to package.json
```
