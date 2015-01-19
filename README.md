[angular-meteor](http://angularjs.meteor.com/tutorial) [![Build Status](https://travis-ci.org/Urigo/angular-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular-meteor) [![Coverage Status](https://coveralls.io/repos/yagoferrer/angular-meteor/badge.svg?branch=master)](https://coveralls.io/r/yagoferrer/angular-meteor?branch=master)
======================================================
> The power of Meteor and the simplicity and eco-system of AngularJS

# New v0.6 - the biggest changes so far!

We just released angular-meteor version 0.6.0 with a lot of exciting new features, including new API's for collections, templates and routing. It does have some breaking changes too. You can read more on the details in the [release notes](https://github.com/Urigo/angular-meteor/releases/tag/0.6.0)

Update to the new version by running:

```sh
$ meteor update
```

## Please support our ng-conf 2015 talk proposal by commenting on it [here](https://github.com/ng-conf/submissions-2015/pull/172)

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) `$ curl https://install.meteor.com | /bin/sh`
2. Create a new meteor app using `$ meteor create myapp` or navigate to the root of your existing app
3. Install urigo:angular `$ meteor add urigo:angular`

## Resources
- [Getting started tutorial](https://angularjs.meteor.com/tutorial)
- [Meteor package - urigo:angular](https://atmospherejs.com/urigo/angular)
- [Roadmap - Trello board](https://trello.com/b/Wj9U0ulk/angular-meteor)
- [Mailing list - Google group](https://groups.google.com/forum/#!forum/angular-meteor)

## Contributing
We would love contributions in:

1. Code
2. [Tutorial](http://angularjs.meteor.com/tutorial) - our goal with the tutorial is to add as many common tasks as possible. If you want to create and add your own chapter we would be happy to help you writing and adding it.
3. [External issues](https://github.com/Urigo/angular-meteor/issues/109) - help us push external issues that affect our community.
4. [Roadmap](https://trello.com/b/Wj9U0ulk/angular-meteor) - you can add a card about want you want to see in the library or in the tutorial.

We are also considering money compensation for contributors, more as a tribute then a profit for now.

## Contributor Developer Setup
Create a directory for your local packages.
```bash
$ mkdir meteorLocalPackages
```
Add the environmental variable `PACKAGE_DIRS` to your `.bash_profile`
```bash
echo "export PACKAGE_DIRS=$HOME/meteorLocalPackages" >> ~/.bash_profile;
```
Fork the project.

Pull the repo from the local packages directory.
```bash
cd ~/meteorLocalPackages
git clone https://github.com/[your_username]/angular-meteor.git my-package
```
Create your Meteor Project
```bash
meteor create myProject
cd myProject
```
Create a folder called 'packages' under myProject

Create a link to your local package under the 'packages' folder

Add your local package
```
meteor add my-package
```

Now you can start using your own copy of the `angular-meteor` project from `myProject`.

## Usage
### Table of Contents
- [App initialization](#app-initialization)
- [Data binding (new method to avoid conflicts)](#data-binding)
- [Using Meteor Collections](#using-meteor-collections)
- [Adding controllers, directives, filters and services](#adding-controllers-directives-filters-and-services)
- [Routing](#routing)
- [User service](#user)
- [Meteor methods with promises](#meteor-methods-with-promises)
- [Bind Meteor session](#bind-meteor-session)

### App initialization

If you have a module called myModule, you can initialize your app like you would normally and by specifying angular-meteor as a dependency:

```js
var myModule = angular.module('myModule', ['angular-meteor']);
```

You don't need to bootstrap the application manually, simply specifying the `ng-app` attribute on a container element will do (*Meteor currently doesn't allow attributes to be set on the &lt;body&gt;)*.

[More in step 0 in the tutorial](http://angularjs.meteor.com/tutorial/step_00)

### Data binding

From angular-meteor version 0.6 you can use Angular's default template delimiters and there is no need to change them.

However, you need to write your Angular template markup in `.tpl` files, since Meteor won't look at those files as Spacebars templates. Tying HTML and `.tpl` files together isn't very difficult, we can simply use Angular's `ng-include`.

*It's worth noting that Meteor will resolve the URL's you give `ng-include` from the root of your project, not relative to the file you're viewing in your browser.*

`client/index.html`:

```html
<head>
    <title>Angular and Meteor</title>
</head>

<body>
    <div ng-app="myModule">
        <ng-include src="'/client/views/user.tpl'"></ng-include>
        <ng-include src="'/client/views/settings.tpl'"></ng-include>
    </div>
</body>
```

`client/views/user.tpl`:

```html
<div>
    <label>Name:</label>
    <input type="text" ng-model="yourName" placeholder="Enter a name here">

    <h1>Hello {{yourName}}!</h1>
</div>
```

[More in step 2 of the tutorial](http://angularjs.meteor.com/tutorial/step_02)

### Using Meteor Collections

angular-meteor provides 3-way data binding (view-client-server) by tying a Meteor collection to an Angular model. The API to accomplish this is [$meteorCollection](http://angularjs.meteor.com/api/meteorCollection).

```js
$scope.todos = $meteorCollection(Todos);
```

[More in step 3 of the tutorial](http://angularjs.meteor.com/tutorial/step_03)

### Subscribe

[$meteorSubscribe.subscribe](http://angularjs.meteor.com/api/subscribe) is a wrapper for `Meteor.subscribe` that returns a promise.

Here's an example of how to tie a Meteor collection to a clean Angular model in the form of an array:

```js
$meteorSubscribe.subscribe('Todos').then(function () {
    $scope.todos = $meteorCollection(Todos);
});
```

### Adding controllers, directives, filters and services

When adding controllers and the likes, remember to use [Dependency Injection](http://docs.angularjs.org/guide/di). This is common Angular practice and helps you avoid problems when minifying and obfuscating code.

```js
app.controller('TodoCtrl', ['$scope', '$meteorCollection',
function($scope, $meteorCollection) {

    $scope.todos = $meteorCollection(Todos);

    $scope.addTodo = function() {
        $scope.todos.push({text:$scope.todoText, done:false});
        $scope.todoText = '';
    };

    $scope.saveTodo = function(){
        $scope.todos.save($scope.newTodo);
    };
}
]);
```

### Routing

You no longer need to use the special [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) package. Instead, you can include [angular-ui-router](https://github.com/angular-ui/ui-router) either with Bower by using [mquandalle:bower](https://atmospherejs.com/mquandalle/bower) or manually by downloading it and injecting it with dependency injection like you would with any other Angular module.

More on how to actually use angular-ui-router in [step 5 of the tutorial](http://angularjs.meteor.com/tutorial/step_05)

### &lt;meteor-include&gt;

You can include Meteor's native templates with the [meteor-include](http://angularjs.meteor.com/api/meteor-include) directive.

```html
<template name="todoList">
    A couple of todos
</template>

<meteor-include src='todoList'></meteor-include>
```

#### Caveat regarding &lt;meteor-include&gt;

The 0.6 release relies more heavily on Angular's default templating system and it is now usually recommended that you use `ng-include` over `meteor-include`. This is because you can't use Angular's template delimiters directly within Meteor templates and you would still need to use an `ng-include` directive to include any Angular template markup in your Meteor templates.

Although it is possible to combine the two systems for including templates, using one of them to the furthest extent possible helps us avoid the recipe for headaches that is unnecessarily deep template hierarchies.

### User

angular-meteor provides two $rootScope variables to support Meteor.user when working with Meteor's accounts package. [Documentation](http://angularjs.meteor.com/api/user).

```js
$rootScope.currentUser; // Currently logged in user and its data
$rootScope.loggingIn; // true if a Meteor login method is currently in progress
```

[More in step 8 of the tutorial](http://angularjs.meteor.com/tutorial-02/step_08)

### Meteor methods with promises

[$meteorMethods](http://angularjs.meteor.com/api/methods) calls a Meteor method and returns a promise.

```js
$meteorMethods.call('addUser', username).then(function (data) {
    console.log('User added', data);
});
```

### Bind Meteor session

[$meteorSession](http://angularjs.meteor.com/api/session) binds a scope variable to a Meteor Session variable.

```js
$meteorSession('counter').bind($scope, 'counter');
```

### Additional packages

Using this method, additional functionality has been provided to urigo:angular-meteor in the form of separate Meteor packages that expose and inject angular modules into angular-meteor. These packages have been developed by either the angular-meteor team and/or by third parties. The following is a non-exhaustive list of these packages:

- [urigo:ionic](https://github.com/Urigo/meteor-ionic) [Ionic Framework](http://ionicframework.com/) on top of Meteor.
- [netanelgilad:angular-file-upload](https://github.com/netanelgilad/meteor-angular-file-upload) empowers angular-meteor with [angular-file-upload](https://github.com/nervgh/angular-file-upload) module.
- [davidyaha:smart-table](https://github.com/davidyaha/meteor-smart-table) empowers angular-meteor with [smart-table](https://github.com/lorenzofox3/Smart-Table) module.
- [netanelgilad:angular-sortable-view](https://github.com/netanelgilad/meteor-angular-sortable-view/) empowers angular-meteor with [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view) module.
- [netanelgilad:text-angular](https://github.com/netanelgilad/meteor-textAngular/) empowers angular-meteor with [textAngular](https://github.com/fraywing/textAngular) module.
- [tonekk:angular-moment](https://github.com/tonekk/meteor-angular-moment) empowers angular-meteor with [angularMoment](https://github.com/urish/angular-moment) module.

Feel free to make angular-meteor module smart packages, and please contact [urigo](https://github.com/urigo) if you would like your package to be listed here as well. Be sure to be compatible with Meteor 0.9.0 and above and it's packaging system!

### Acknowledgement

This project started as [ngMeteor](https://github.com/loneleeandroo/ngMeteor), a pre-0.9 meteorite package. Since then a lot has changed but that was the main base.

Also, a lot of features were inspired by @superchris's [angular-meteor fork of ngMeteor](https://github.com/superchris/angular-meteor)
