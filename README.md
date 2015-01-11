[angular-meteor](http://angularjs.meteor.com/tutorial) [![Build Status](https://travis-ci.org/Urigo/angular-meteor.svg?branch=yago/tests)](https://travis-ci.org/Urigo/angular-meteor)
======================================================
> The power of Meteor and the simplicity and eco-system of AngularJS

# New 0.6 version - biggest change we had so far!
We just released angular-meteor version 0.6-alpha with a lot of exciting new features.

It has a completely new API for collections, templates and routing.

It also has breaking changes.
Please read more and get ready here: [0.6.0-alpha release](https://github.com/Urigo/angular-meteor/releases/tag/0.6.0-alpha)

We will support the old API only until the end of the beta version so please update your applications.

To try out the alpha version and see that you are ready:

    meteor add urigo:angular@0.6.0-alpha

# Please support our ng-conf 2015 talk proposal by commenting on it here:
[https://github.com/ng-conf/submissions-2015/pull/172](https://github.com/ng-conf/submissions-2015/pull/172)

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) <code>curl https://install.meteor.com | /bin/sh</code>
2. Create a new meteor app using <code>meteor create myapp</code> or navigate to the root of your existing app.
4. Install urigo:angular <code>meteor add urigo:angular</code>

## Getting started tutorial
[http://angularjs.meteor.com/tutorial](http://angularjs.meteor.com/tutorial)

## Package
[urigo:angular](https://atmospherejs.com/urigo/angular)

## Roadmap
[https://trello.com/b/Wj9U0ulk/angular-meteor](https://trello.com/b/Wj9U0ulk/angular-meteor)

## Mailing list
[https://groups.google.com/forum/#!forum/angular-meteor](https://groups.google.com/forum/#!forum/angular-meteor)

## Contributing
We would love contributions in:

1. Code
2. [Tutorial](http://angularjs.meteor.com/tutorial) - Our goal with the tutorial is to add as many common tasks as possible. If you want to create and add your own chapter we would be happy to help you writing and adding it.
3. [External issues](https://github.com/Urigo/angular-meteor/blob/master/External-issues.md) - help us push external issues that affect our community.
4. [Roadmap](https://trello.com/b/Wj9U0ulk/angular-meteor) - You can add a card about want you want to see in the library or in the tutorial.

* We are also considering money compansation for contributers, more as a tribute then a profit for now.

## Usage
### Table of Contents
- [App initialization](https://github.com/urigo/angular-meteor#app-initialization)
- [New Data-Binding to avoid conflict](https://github.com/urigo/angular-meteor#new-data-binding-to-avoid-conflict)
- [Using Meteor Collections](https://github.com/urigo/angular-meteor#using-meteor-collections)
- [Adding controllers, directives, filters and services](https://github.com/urigo/angular-meteor#adding-controllers-directives-filters-and-services)
- [Creating and inserting template views](https://github.com/urigo/angular-meteor#creating-and-inserting-template-views)
- [Routing](https://github.com/urigo/angular-meteor#routing)
- [User service](https://github.com/urigo/angular-meteor#User)
- [Meteor methods with promises](https://github.com/urigo/angular-meteor#meteor-methods-with-promises)
- [Bind Meteor session](https://github.com/urigo/angular-meteor#bind-meteor-session)

### App initialization
If you have a module called myModule, for example:

    myModule = angular.module('myModule',['angular-meteor']);
    
[More in step 0 in the tutorial](http://angularjs.meteor.com/tutorial/step_00)
    
### Data-Binding
From angulr-meteor version 0.6 you can use AngularJS's default delimiters and there is no need to change them.

All you need to do is change your AngularJS HTML template files to end with .tpl extension like - myFile.tpl

Then you can use it regularly, for example:

    <div>
        <label>Name:</label>
        <input type="text" ng-model="yourName" placeholder="Enter a name here">
        <hr>
        <h1>Hello {{yourName}}!</h1>
    </div>
    
[More in step 2 of the tutorial](http://angularjs.meteor.com/tutorial/step_02)    

### Using Meteor Collections

[$meteorCollection](http://angularjs.meteor.com/api/meteorCollection)

[More in step 3 of the tutorial](http://angularjs.meteor.com/tutorial/step_03)

### Subscribe

[$meteorSubscribe.subscribe](http://angularjs.meteor.com/api/subscribe)

### Adding controllers, directives, filters and services
To prevent errors when minifying and obfuscating the controllers, directives, filters or services, you need to use [Dependency Injection](http://docs.angularjs.org/guide/di). For example:

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
       
        $scope.remaining = function() {
          var count = 0;
          angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
          });
          return count;
        };
       
        $scope.archive = function() {
          angular.forEach($scope.todos, function(todo) {
            if (todo.done) $scope.todos.remove(todo);
          });
        };
      }
    ]);

### Routing
There is no need anymore to use the [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) pacage.
You can just include [ui-router](https://github.com/angular-ui/ui-router) with the [meteor bower package](https://atmospherejs.com/mquandalle/bower) and in templateUrl insert the path to the tpl files.

[More in step 5 of the tutorial](http://angularjs.meteor.com/tutorial/step_05)

### meteor-include

You can include Meteor's native templates.

[meteor-include](http://angularjs.meteor.com/api/meteor-include)

    
### User
    
[angular-meteor User](http://angularjs.meteor.com/api/user)
    
[More in step 8 of the tutorial](http://angularjs.meteor.com/tutorial-02/step_08)    

### Meteor methods with promises

[$meteorMethods](http://angularjs.meteor.com/api/methods)

### Bind Meteor session

[$meteorSession](http://angularjs.meteor.com/api/session)
    
### Additional packages

Using this method, additional functionality has been provided to urigo:angular-meteor in the form of separate Meteor packages that expose and inject angular modules into angular-meteor. These packages have been developed by either the angular-meteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [urigo:ionic](https://github.com/Urigo/meteor-ionic) [Ionic Framework](http://ionicframework.com/) on top of Meteor.
- [netanelgilad:angular-file-upload](https://github.com/netanelgilad/meteor-angular-file-upload) empowers angular-meteor with [angular-file-upload](https://github.com/nervgh/angular-file-upload) module.
- [davidyaha:smart-table](https://github.com/davidyaha/meteor-smart-table) empowers angular-meteor with [smart-table](https://github.com/lorenzofox3/Smart-Table) module.
- [netanelgilad:angular-sortable-view](https://github.com/netanelgilad/meteor-angular-sortable-view/) empowers angular-meteor with [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view) module.
- [netanelgilad:text-angular](https://github.com/netanelgilad/meteor-textAngular/) empowers angular-meteor with [textAngular](https://github.com/fraywing/textAngular) module.
- [tonekk:angular-moment](https://github.com/tonekk/meteor-angular-moment) empowers angular-meteor with [angularMoment](https://github.com/urish/angular-moment) module.

Feel free to make angular-meteor module smart packages, and please contact [urigo](https://github.com/urigo) if you would like your package to be listed here as well.
Be sure to be compatible with Meteor 0.9.0 and above and it's packaging system!

### Acknowledgement

This project started as [ngMeteor](https://github.com/loneleeandroo/ngMeteor), a pre-0.9 meteorite package. 
Since then a lot has changed but that was the main base.

Also, a lot of features were inspired by @superchris's [angular-meteor fork of ngMeteor](https://github.com/superchris/angular-meteor)
