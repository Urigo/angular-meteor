<a name="1.3.11"></a>
## [1.3.11](https://github.com/Urigo/angular-meteor/compare/1.3.10...v1.3.11) (2016-05-18)


### Features

* **Core:** onStart callback ([802356c](https://github.com/Urigo/angular-meteor/commit/802356c))
* **templates:** exports templateUrl ([d687049](https://github.com/Urigo/angular-meteor/commit/d687049)), closes [#1313](https://github.com/Urigo/angular-meteor/issues/1313)
* **templates:** optional error and warning of missing template ([5657db4](https://github.com/Urigo/angular-meteor/commit/5657db4)), closes [#1274](https://github.com/Urigo/angular-meteor/issues/1274)

* In templates, the best practice is to move away from `angular-templates` package and to import the template's content with the [urigo:static-templates](https://github.com/urigo/meteor-static-templates) package. This is not a breaking change but you can start migrating if you want.


<a name="1.3.10"></a>
## [1.3.10](https://github.com/Urigo/angular-meteor/compare/1.3.9...v1.3.10) (2016-04-11)


### Bug Fixes

* **#1309:** Scope.bindToContext() will be applied on scope if no context is specified, and a ([210f16a](https://github.com/Urigo/angular-meteor/commit/210f16a))
* **autorun:** destroy event listener once autorun has been stopped ([2ae0c22](https://github.com/Urigo/angular-meteor/commit/2ae0c22))



<a name="1.3.8"></a>
## [1.3.8](https://github.com/Urigo/angular-meteor/compare/1.3.7...v1.3.8) (2016-03-28)


### Bug Fixes

* **reactive:** empty collection on cursor change ([252d2d4](https://github.com/Urigo/angular-meteor/commit/252d2d4))
* **viewmodel:** Scope and view model logics can now be used all together ([c78c507](https://github.com/Urigo/angular-meteor/commit/c78c507))
* **viewmodel:** View model and scope can both use 'getReactively' ([dc0eb88](https://github.com/Urigo/angular-meteor/commit/dc0eb88))
* commonjs support for es6 modules ([67a218f](https://github.com/Urigo/angular-meteor/commit/67a218f))
* fix missing dependencies in npm ([ccf5eec](https://github.com/Urigo/angular-meteor/commit/ccf5eec))

### Features

* meteor 1.3 compatible ([39cc970](https://github.com/Urigo/angular-meteor/commit/39cc970))
* **$angularMeteorSettings:** suppress warnings ([a787c1d](https://github.com/Urigo/angular-meteor/commit/a787c1d))

### Performance Improvements

* **reactive:** skip comparing on initial data ([21a1805](https://github.com/Urigo/angular-meteor/commit/21a1805))



<a name="1.3.7"></a>
## [1.3.7](https://github.com/Urigo/angular-meteor/compare/1.3.6...v1.3.7) (2016-02-28)


### Bug Fixes

* **$angularMeteorSettings:** unknown provider ([bb1422c](https://github.com/Urigo/angular-meteor/commit/bb1422c))
* **$angularMeteorSettings:** unknown provider ([44afc52](https://github.com/Urigo/angular-meteor/commit/44afc52))
* **angular-meteor-data:** missing file extension ([5bf38ea](https://github.com/Urigo/angular-meteor/commit/5bf38ea))
* Apply mixins to rootScope ([1a1c61b](https://github.com/Urigo/angular-meteor/commit/1a1c61b))
* Legacy modules tests not passing ([504952e](https://github.com/Urigo/angular-meteor/commit/504952e))

### Features

* support for new angular-templates ([5ab8fe7](https://github.com/Urigo/angular-meteor/commit/5ab8fe7))
* **templates:** make compatible with modules ([fefa70c](https://github.com/Urigo/angular-meteor/commit/fefa70c))
