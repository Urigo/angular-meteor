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
