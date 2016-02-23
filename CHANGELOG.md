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

### Uptates

Angular 2 upgraded to the last version.

### Breaking Changes

- In the latest releases of Angular 2 (alpha-50 and up) `angular2/angular2` namespace were devided into several new ones, mainly, `angular2/core` and `angular2/common`
- The dash symbol were removed in the selectors of main directives, i.e., instead of `ng-if` you should use `ngIf` now

For more information about the latest API, please, refer to the official [docs](https://angular.io/docs/ts/latest/api).

In order to get new Angular 2 definition files, you'll need to remove `typings\angular2` folder and `typings\angular2.d.ts` file to let 
the package install updated version.
