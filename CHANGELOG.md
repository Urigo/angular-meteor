<a name="0.5.6"></a>
## 0.5.6 (2016-07-08)


### Bug Fixes

* **Angular2:** add Angular2 peer dependencies to be installed with this NPM ([4be1f6a](https://github.com/Urigo/angular2-meteor/commit/4be1f6a))
* **build:** add output (js, d.ts) files back to the build folder and change package.json accordantly ([254a758](https://github.com/Urigo/angular2-meteor/commit/254a758))
* **build:** move build.sh to Gulp, fix https://github.com/Urigo/angular2-meteor/issues/186 ([a73cd16](https://github.com/Urigo/angular2-meteor/commit/a73cd16))
* **Default template:** add default app template to Angular2-Meteor ([652c138](https://github.com/Urigo/angular2-meteor/commit/652c138))
* **MeteorComponent:** fix https://github.com/Urigo/angular2-meteor/issues/132 ([4d7a40e](https://github.com/Urigo/angular2-meteor/commit/4d7a40e))
* **MeteorComponent.autorun:** #149 ([d049759](https://github.com/Urigo/angular2-meteor/commit/d049759))
* **NgZone:** patch main Meteor methods ([2145847](https://github.com/Urigo/angular2-meteor/commit/2145847))
* **npm install for Windows:** https://github.com/Urigo/angular2-meteor/issues/185 ([6660ca3](https://github.com/Urigo/angular2-meteor/commit/6660ca3))
* **Promises:** fix https://github.com/Urigo/angular2-meteor/issues/238, ([a611ed8](https://github.com/Urigo/angular2-meteor/commit/a611ed8))
* **README:** fix #129 ([e33880c](https://github.com/Urigo/angular2-meteor/commit/e33880c)), closes [#129](https://github.com/Urigo/angular2-meteor/issues/129)
* **reruns of the ngzone:** tackle https://github.com/Urigo/angular2-meteor/issues/140 ([f79289f](https://github.com/Urigo/angular2-meteor/commit/f79289f))
* **typings:** https://github.com/Urigo/angular2-meteor/issues/176 ([d66ea8f](https://github.com/Urigo/angular2-meteor/commit/d66ea8f))
* **unit tests:** beta.10 is unknowingly not downloadable on the travis ([b99cdba](https://github.com/Urigo/angular2-meteor/commit/b99cdba))
* bithound ([32abda1](https://github.com/Urigo/angular2-meteor/commit/32abda1))
* tests ([3b25feb](https://github.com/Urigo/angular2-meteor/commit/3b25feb))
* tests ([cdf0d5a](https://github.com/Urigo/angular2-meteor/commit/cdf0d5a))
* tests ([482461b](https://github.com/Urigo/angular2-meteor/commit/482461b))
* typo in the typings section ([fd94185](https://github.com/Urigo/angular2-meteor/commit/fd94185))
* typos in common issues and troubleshoot ([d9b9402](https://github.com/Urigo/angular2-meteor/commit/d9b9402))
* **unit tests:** change to a 1.3 beta version that works ok with the jasmine ([27b4d5c](https://github.com/Urigo/angular2-meteor/commit/27b4d5c))
* **unit tests:** correct angular2-meteor URL, add additional layer of testing by converting .js files to .ts ones, update Meteor to 1.3-rc.4 ([c0c23cd](https://github.com/Urigo/angular2-meteor/commit/c0c23cd))


### Features

* **index.js, Angular2:** add index.js to the NPM, add direct Angular2 dependency to the package.json ([7ef35eb](https://github.com/Urigo/angular2-meteor/commit/7ef35eb))
* **templates:** exports templateUrl ([5f2c42c](https://github.com/Urigo/angular2-meteor/commit/5f2c42c))



## 0.3.3

### Breaking Changes

- This package is no longer supported from Atmosphere, and will be installed from NPM from Meteor 1.3 and up.
- Removed `bootstrap` module (`angular2-meteor/bootstrap`) in favor of the original Angular 2.0 bootstrap's.
- Removed `packages/*` - they will be moved into a separated NPM modules in the future.
- Imports location will be defined as NPM imports: `import {SomePackage} from 'angular2-meteor/cursor_handlers';`
- Removed the need for `SystemJS`, now uses Meteor's ES6 imports that depends on CommonJS.

### Updates

- Build process now use Webpack instead of Meteor build tool.
- Tests now executed inside a Meteor context which means that there is a meteor app that uses the actual code, because Angular2-Meteor now does not depends of Meteor packages system (Atmosphere) and uses NPM instead.


## v0.3.2

### Updates

Angular 2 upgraded to the first beta version.

## v0.3.0

### Updates

Angular 2 upgraded to the last version.

### Breaking Changes

- In the latest releases of Angular 2 (alpha-50 and up) `angular2/angular2` namespace were devided into several new ones, mainly, `angular2/core` and `angular2/common`
- The dash symbol were removed in the selectors of main directives, i.e., instead of `ng-if` you should use `ngIf` now

For more information about the latest API, please, refer to the official [docs](https://angular.io/docs/ts/latest/api).

In order to get new Angular 2 definition files, you'll need to remove `typings\angular2` folder and `typings\angular2.d.ts` file to let
the package install updated version.
