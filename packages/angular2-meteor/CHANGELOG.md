<a name="0.7.0-beta.1"></a>
# [0.7.0-beta.1](https://github.com/Urigo/angular2-meteor/compare/0.6.0...v0.7.0-beta.1) (2016-08-21)


### Bug Fixes

* **MeteorComponent:** fix #337 ([63f95b6](https://github.com/Urigo/angular2-meteor/commit/63f95b6)), closes [#337](https://github.com/Urigo/angular2-meteor/issues/337) [#323](https://github.com/Urigo/angular2-meteor/issues/323)
* #331 ([6fe0d45](https://github.com/Urigo/angular2-meteor/commit/6fe0d45))
* fix #331 ([5a976ac](https://github.com/Urigo/angular2-meteor/commit/5a976ac)), closes [#331](https://github.com/Urigo/angular2-meteor/issues/331)



<a name="0.6.2"></a>
## [0.6.2](https://github.com/Urigo/angular2-meteor/compare/0.6.0...v0.6.2) (2016-07-20)


### Bug Fixes

* **MeteorComponent:** fix #337 ([63f95b6](https://github.com/Urigo/angular2-meteor/commit/63f95b6)), closes [#337](https://github.com/Urigo/angular2-meteor/issues/337) [#323](https://github.com/Urigo/angular2-meteor/issues/323)



<a name="0.6.0"></a>
## 0.6.0 (2016-07-09)

### Breaking Changes

Importing URLs of the component templates in a way as `import url from './foo.html'` will be deprecated from `angular2-compilers@0.6.0` in favor of the inline templates. That means the expression above will become now `import template from './foo.html'`.

For the migration, we've added a special JS-module to `angular2-compilers@0.5.8` that exports template content as well but with a special suffix added to the URL, i.e., `!raw` and the whole path is `./foo.html!raw`. URLs like `./foo.html!raw` are supported by `angular2-compilers@0.6.0` as well allowing you to transit easily.

`angular2-compilers@0.6.0` is based on `urigo:static-html-compiler@0.1.4` ([a0d28d3](https://github.com/Urigo/angular2-meteor/commit/a0d28d3)).

### Features

- Main Meteor methods are now patched to run ngZone after the callback executions [(2145847)](https://github.com/Urigo/angular2-meteor/commit/2145847). In other words, `autoBind` param of the `MeteorComponent` wrappers is set to true by default. Fixes this [issue](https://github.com/Urigo/angular2-meteor/issues/140) (thanks @staeke for the idea and discussion)
- `MeteorComponent` is improved to support server side rendering. One can use `angular2-meteor` on the server along with [`angular2-meteor-universal`](https://github.com/barbatus/angular2-meteor-universal)
- LESS and SASS compilers are added to `angular2-compilers@0.6.0`. Angular2 components can start importing styles in the ES6 style (as templates), if styles are located in the root `imports` folder

### Bug Fixes

- MeteorComponent.autorun: #149 ([d049759](https://github.com/Urigo/angular2-meteor/commit/d049759))
- Issue with promises: #238 ([a611ed8](https://github.com/Urigo/angular2-meteor/commit/a611ed8))

### Other

- Angular2-Meteor for Meteor 1.2 based on SystemJS have been deprecated (old code can be found in the `legacy` branch)
- Usage Gulp in the build have been deprecated in favor of NPM scripts
- Tests have been moved to be based on Mocha and Chai (Meteor 1.3 style)

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
