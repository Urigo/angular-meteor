<a href="http://angular-meteor.com/"><img src="http://angular-meteor.com/images/logo-large.png" width="60" height="60" /></a>  [angular-meteor](http://angular-meteor.com/tutorial) [![Build Status](https://travis-ci.org/Urigo/angular-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular-meteor) [![Bower version](https://badge.fury.io/bo/angular-meteor.svg)](http://badge.fury.io/bo/angular-meteor)
======================================================

[![Join the chat at https://gitter.im/Urigo/angular-meteor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Urigo/angular-meteor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> The power of Meteor and the simplicity and eco-system of AngularJS

[![ng-conf](http://img.youtube.com/vi/_mu6BWsnaPM/0.jpg)](https://www.youtube.com/watch?v=_mu6BWsnaPM)

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) `$ curl https://install.meteor.com | /bin/sh`
2. Create a new meteor app using `$ meteor create myapp` or navigate to the root of your existing app
3. Install urigo:angular `$ meteor add urigo:angular`

## Resources
- [Getting started tutorial](https://angular-meteor.com/tutorial)
- [Example application](https://github.com/Urigo/meteor-angular-socially) (Final version of the tutorial)
- [angular-meteor University](https://github.com/Urigo/meteor-angular-socially#angular-meteor-university-)
- Questions and help - [stack-overflow `angular-meteor` tag](http://stackoverflow.com/questions/tagged/angular-meteor)
- Discussions - [Meteor Forums](https://forums.meteor.com/) and [![Join the chat at https://gitter.im/Urigo/angular-meteor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Urigo/angular-meteor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
- [Report issues](https://github.com/Urigo/angular-meteor/issues)
- [Change Log, updates and breaking changes](https://github.com/Urigo/angular-meteor/releases)
- [Roadmap - Trello board](https://trello.com/b/Wj9U0ulk/angular-meteor)
- [angular-meteor Blog](https://medium.com/angular-meteor)
- [Meteor package - urigo:angular](https://atmospherejs.com/urigo/angular)
- [Awesome Meteor](https://github.com/Urigo/awesome-meteor) - A curated, community driven list of awesome Meteor packages, libraries, resources and shiny thing

## Contributing
We would love contributions in:

1. Code
2. [Tutorial](http://angular-meteor.com/tutorial) - our goal with the tutorial is to add as many common tasks as possible. If you want to create and add your own chapter we would be happy to help you writing and adding it.
3. [Roadmap](https://trello.com/b/Wj9U0ulk/angular-meteor) - you can add a card about what you want to see in the library or in the tutorial.
4. I ([Urigo](https://github.com/urigo)) live around the world with one small bag, so another way of contributing can be by offering me a place to sleep somewhere interesting around the world that I have to see :) 

If you want to contribute and need help or don't know what should you do, you can [contact me directly](https://github.com/urigo)

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

You don't need to bootstrap the application manually, simply specifying the `ng-app` attribute on a container element will do.

[More in step 0 in the tutorial](http://angular-meteor.com/tutorial/step_00)

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

[More in step 0 of the tutorial](http://angular-meteor.com/tutorial/step_00)

### Using Meteor Collections

angular-meteor provides 3-way data binding (view-client-server) by tying a Meteor collection to an Angular model. The API to accomplish this is [$meteor.collection](http://angular-meteor.com/api/meteorCollection).

```js
$scope.todos = $meteor.collection(Todos);
```

[More in step 3 of the tutorial](http://angular-meteor.com/tutorial/step_03)

### Subscribe

[$meteor.subscribe](http://angular-meteor.com/api/subscribe) is a wrapper for `Meteor.subscribe` that returns a promise.

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

More on how to actually use angular-ui-router in [step 5 of the tutorial](http://angular-meteor.com/tutorial/step_05)

### &lt;meteor-include&gt;

You can include Meteor's native templates with the [meteor-include](http://angular-meteor.com/api/meteor-include) directive.

```html
<template name="todoList">
    A couple of todos
</template>

<meteor-include src='todoList'></meteor-include>
```
#### Passing arguments to meteor-include
To pass parameters to a meteor-include directive, create a Blaze template that includes the template you want to include with parameters and include that template with meteor-include:

     <template name="quickFormWithParameters">
       {{> quickForm collection="Books" id="insertBookForm" type="insert"}}
     </template>
     
     <meteor-include src="quickFormWithParameters">
     
#### Caveat regarding &lt;meteor-include&gt;

Since 0.6 release, angular-meteor relies more heavily on Angular's default templating system and it is now usually recommended that you use `ng-include` over `meteor-include`. This is because you can't use Angular's template delimiters directly within Meteor templates and you would still need to use an `ng-include` directive to include any Angular template markup in your Meteor templates.

### User Authentication

angular-meteor provides complete support for the [Meteor accounts system](http://docs.meteor.com/#/full/accounts_api). more details here -  [Documentation](http://angular-meteor.com/api/user).

[More in step 8 of the tutorial](http://angular-meteor.com/tutorial/step_08)

### Meteor methods with promises

[$meteor.call](http://angular-meteor.com/api/methods) calls a [Meteor method](http://docs.meteor.com/#/full/meteor_methods) and returns a promise.

```js
$meteor.call('addUser', username).then(function (data) {
    console.log('User added', data);
});
```

### Bind Meteor session

[$meteor.session](http://angular-meteor.com/api/session) binds a scope variable to a Meteor Session variable.

```js
$meteor.session('counter').bind($scope, 'counter');
```

### Additional packages
The following is a non-exhaustive list of Meteor packages common Angular libraries:

- [Meteor packages for Angular 3rd party libraries](https://trello.com/c/EGCdgHAk/47-official-meteor-packages-to)
- [civilframe:angular-jade](https://github.com/civilframe/meteor-angular-jade) enables the usage of JADE files in place of HTML files. Files ending in *.ng.jade and will be compiled to *.html.
- [pbastowski:angular-babel](https://github.com/pbastowski/angular-meteor-babel/) empowers angular-meteor with Babel and ng-annotate all in the one package. Files ending in .es6 will first be transpiled by Babel and then annotated with ng-annotate.

Feel free to make more Angular packages and add them to that list as well.

### Acknowledgement

This project started as [ngMeteor](https://github.com/loneleeandroo/ngMeteor), a pre-0.9 meteorite package. Since then a lot has changed but that was the main base.

Also, a lot of features were inspired by @superchris's [angular-meteor fork of ngMeteor](https://github.com/superchris/angular-meteor)
