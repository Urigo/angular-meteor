[angular-meteor](http://angularjs.meteor.com/tutorial)
======================================================
> The power of Meteor and the simplicity and eco-system of AngularJS

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
We would love contributions in code and in the tutorial.

Our roadmap is here: [Public Trello board](https://trello.com/b/Wj9U0ulk/angular-meteor).
You can add a card about want you want to see in the library or in the tutorial.

Our goal with the tutorial is to add as many common tasks as possible.
If you want to create and add your own chapter we would be happy to help you writing and adding it.

We are also considering money compansation for contributers, more as a tribute then a profit for now.

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
    
### New Data-Binding to avoid conflict
To prevent conflicts with Meteor's Blaze live templating engine, angular-meteor has changed the default AngularJS data bindings from <code>{{...}}</code> to <code>[[...]]</code>. For example:

    <div>
        <label>Name:</label>
        <input type="text" ng-model="yourName" placeholder="Enter a name here">
        <hr>
        <h1>Hello [[yourName]]!</h1>
    </div>
    
[More in step 2 of the tutorial](http://angularjs.meteor.com/tutorial/step_02)    

### Using Meteor Collections

[$collection](http://angularjs.meteor.com/api/collection)

[$collection.bind](http://angularjs.meteor.com/api/collection-bind)

[$collection.bindOne](http://angularjs.meteor.com/api/collection-bindOne)

[AngularMeteorCollection](http://angularjs.meteor.com/api/AngularMeteorCollection)


[More in step 6 of the tutorial](http://angularjs.meteor.com/tutorial/step_06)

### Subscribe

[$subscribe.subscribe](http://angularjs.meteor.com/api/subscribe)

### Adding controllers, directives, filters and services
To prevent errors when minifying and obfuscating the controllers, directives, filters or services, you need to use [Dependency Injection](http://docs.angularjs.org/guide/di). For example:

    app.controller('TodoCtrl', ['$scope', '$collection',
      function($scope, $collection) {
        $collection("todos", $scope);
       
        $scope.addTodo = function() {
          $scope.todos.add({text:$scope.todoText, done:false});
          $scope.todoText = '';
        };

        $scope.saveTodo = function(){
          $scope.todos.add($scope.todos);
        }
       
        $scope.remaining = function() {
          var count = 0;
          angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
          });
          return count;
        };
       
        $scope.archive = function() {
          angular.forEach($scope.todos, function(todo) {
            if (todo.done) $scope.todos.delete(todo);
          });
        };
      }
    ]);

### Creating and inserting template views
A template is defined using the template tags (this could be in a standalone file or included in another file).

    <template name="foo">
      <h1>Hello, World!</h1>
    </template>

You can render this template using handlebars as you would for any other Meteor app:

    {{> foo}}

Templates will also be added to the $templateCache of the angular-meteor module. To invoke the template in AngularJS you could use ng-view and specify the template in the $templateCache when defining your routes using the $routeProvider or you could use the ng-template directive to render your template like this:

    <ANY ng-template="foo"></ANY>

    <!--Add the ng-controller attribute if you want to load a controller at the same time.-->    
    <ANY ng-template="foo" ng-controller="fooCtrl"></ANY>
    
Templates with names starting with an underscore, for example "_foo", will not be put into the $templateCache, so you will not be able to access those templates using ng-template, ng-include or ng-view.

### meteor-include

You can include Meteor native templates.

[meteor-include](http://angularjs.meteor.com/api/meteor-include)


### Routing
It would be wise to consider using the [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) Meteor package for angular-meteor, which exposes the popular [ui-router](https://github.com/angular-ui/ui-router) module to angular-meteor. For those of you that have grown accustomed to the Meteor methods of routing, angular-meteor is compatible with [Iron Router](https://github.com/EventedMind/iron-router).

[More in step 5 of the tutorial](http://angularjs.meteor.com/tutorial/step_05)
    
### User
    
[angular-meteor User](http://angularjs.meteor.com/api/user)
    
[More in step 8 of the tutorial](http://angularjs.meteor.com/tutorial-02/step_08)    

### Meteor methods with promises

[$methods](http://angularjs.meteor.com/api/methods)

### Bind Meteor session

[$session](http://angularjs.meteor.com/api/session)
    
### Additional packages

Using this method, additional functionality has been provided to urigo:angular-meteor in the form of separate Meteor packages that expose and inject angular modules into angular-meteor. These packages have been developed by either the angular-meteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) empowers angular-meteor with the [ui-router](https://github.com/angular-ui/ui-router) module.
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
