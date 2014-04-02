ngMeteor v0.2
========
> The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.
> [See how ngMeteor just works](http://ng.meteor.com)

> WARNING: This branch is not stable yet. It is subject to experimentation and change.

## TODO for v0.2
### Dependencies
* Update to Angular v1.3.x (latest). (Done)

### Modules
* Add new method to inject angular modules into ngMeteor. (In progress)
* Allow users to define their own angular module, ngMeteor will be injected automatically. (In progress)

### Collections
* Decouple Meteor.subscribe from $collection service to allow users to subscribe to publishers with a different name to the collection, and also allow multiple subscriptions. (Done)
* Allow users to define their own model to attach the $collection service. (Done)
* Include method to save all objects in a model to the collection. (Done)
* Include method to delete all objects in a model from the collection. (Done)
* Include method to allow users to automatically create a three way data bind between model, view and collection. (In progress)

### Templates
* Use ngTemplate's template property to render the Meteor template. (Done)
* Transclude nested templates using the ngTemplate directive. (Done)
* Pass Meteor template event maps to the ngTemplate directive. (Done)
* Store the ngTemplate directive in $templateCache rather than the raw HTML string. (Done)
* More general method to recompile angular code whenever a template is re-rendered using Handlebar helpers, such as #if and with iron-router, than the current workaround for iron-router.

### Documentation
* Update documentation on $collection service with examples.
* Update documentation on ngTemplate directive with examples.
* Update documentation on ngMeteor module injection with examples.
* Move all documentation from README to ng.meteor.com with walkthroughs and examples akin the AngularJS website.

### Optionals
* Create ngMeteor generator for Yeoman to allow users to get started more quickly and easily.