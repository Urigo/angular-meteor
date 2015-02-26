<a href="http://angularjs.meteor.com/"><img src="http://angularjs.meteor.com/images/no-text-logo.png" width="50" height="50" /></a>  [angular-meteor](http://angularjs.meteor.com/tutorial) 
======================================================
> The power of Meteor and the simplicity and eco-system of AngularJS

## Community - Thank you so much for making the [ng-conf 2015 talk](https://github.com/ng-conf/submissions-2015/pull/172) happen!
Follow the talk here - <a href="http://www.ng-conf.org/schedule">
<img src="http://lh3.googleusercontent.com/-LHJwKtNqcU0/UipDx8KHUnI/AAAAAAAAAH4/qeow7Kltot8/s620-no/ng-conf.png" width="50" height="50" />
</a>

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
3. [Roadmap](https://trello.com/b/Wj9U0ulk/angular-meteor) - you can add a card about want you want to see in the library or in the tutorial.

## Contributor Developer Setup

Create your Meteor Project

```bash
meteor create myProject
cd myProject
```

Create a `packages` directory and clone from your forked repo

```bash
mkdir packages
cd packages
git clone https://github.com/[your_username]/angular-meteor.git my-package
```

Add your local package

```
cd ..
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

However, you need to write your Angular template markup in `.ng.html` files, since Meteor won't look at those files as Spacebars templates. Tying HTML and `.ng.html` files together isn't very difficult, we can simply use Angular's `ng-include`.

Please note that the names of the templates to Angular will be their URL as Meteor sees it when minifying the .ng.html files. **Hence every template URL is relative to the root of the Meteor project, and contains no leading forward slash.** This is important to note when working with `ng-include` to include templates.

`client/index.html`:

```html
<head>
    <title>Angular and Meteor</title>
</head>

<body>
    <div ng-app="myModule">
        <ng-include src="'client/views/user.ng.html'"></ng-include>
        <ng-include src="'client/views/settings.ng.html'"></ng-include>
    </div>
</body>
```

`client/views/user.ng.html`:

```html
<div>
    <label>Name:</label>
    <input type="text" ng-model="yourName" placeholder="Enter a name here">

    <h1>Hello {{yourName}}!</h1>
</div>
```

[More in step 2 of the tutorial](http://angularjs.meteor.com/tutorial/step_02)

### Using Meteor Collections

angular-meteor provides 3-way data binding (view-client-server) by tying a Meteor collection to an Angular model. The API to accomplish this is [$meteor.collection](http://angularjs.meteor.com/api/meteorCollection).

```js
$scope.todos = $meteor.collection(Todos);
```

[More in step 3 of the tutorial](http://angularjs.meteor.com/tutorial/step_03)

### Subscribe

[$meteor.subscribe](http://angularjs.meteor.com/api/subscribe) is a wrapper for `Meteor.subscribe` that returns a promise.

Here's an example of how to tie a Meteor collection to a clean Angular model in the form of an array:

```js
$meteor.subscribe('Todos').then(function () {
    $scope.todos = $meteor.collection(Todos);
});
```

### Adding controllers, directives, filters and services

When adding controllers and the likes, remember to use [Dependency Injection](http://docs.angularjs.org/guide/di). This is common Angular practice and helps you avoid problems when minifying and obfuscating code.

```js
app.controller('TodoCtrl', ['$scope', '$meteor',
function($scope, $meteor) {

    $scope.todos = $meteor.collection(Todos);

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

Use to official AngularUI ui-router Meteor package - [angularui:angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router)

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

Since 0.6 release, angular-meteor relies more heavily on Angular's default templating system and it is now usually recommended that you use `ng-include` over `meteor-include`. This is because you can't use Angular's template delimiters directly within Meteor templates and you would still need to use an `ng-include` directive to include any Angular template markup in your Meteor templates.

Although it is possible to combine the two systems for including templates, using one of them to the furthest extent possible helps us avoid the recipe for headaches that is unnecessarily deep template hierarchies.

### User

angular-meteor provides two $rootScope variables to support Meteor.user when working with Meteor's accounts package. [Documentation](http://angularjs.meteor.com/api/user).

```js
$rootScope.currentUser; // Currently logged in user and its data
$rootScope.loggingIn; // true if a Meteor login method is currently in progress
```

[More in step 8 of the tutorial](http://angularjs.meteor.com/tutorial-02/step_08)

### Meteor methods with promises

[$meteor.call](http://angularjs.meteor.com/api/methods) calls a Meteor method and returns a promise.

```js
$meteor.call('addUser', username).then(function (data) {
    console.log('User added', data);
});
```

### Bind Meteor session

[$meteor.session](http://angularjs.meteor.com/api/session) binds a scope variable to a Meteor Session variable.

```js
$meteor.session('counter').bind($scope, 'counter');
```

### Additional packages

To add AngularJS libraries from the community just use the [meteor-bower](https://github.com/mquandalle/meteor-bower) package.

Sometimes an extra logic is needed to include the libraries to Meteor, for that you can create a Meteor package for them.

Similar packages have been developed by either the angular-meteor team and/or by third parties. The following is a non-exhaustive list of these packages:

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
