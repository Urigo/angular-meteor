ngMeteor
========
> The simplest no-conflict way to use AngularJS with Meteor.

> ngMeteor v0.1.22+ works with Blaze.
> ngMeteor v0.2.0+ works with Meteor 0.8.2, 0.8.3, 0.9.0, 0.9.1 and above.

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) <code>curl https://install.meteor.com | /bin/sh</code>
2. Create a new meteor app using <code>meteor create myapp</code> or navigate to the root of your existing app.
4. Install urigo:ngmeteor <code>meteor add urigo:ngmeteor</code>

## Getting started tutorial
[http://angularjs.meteor.com/tutorial](http://angularjs.meteor.com/tutorial)

## Usage
### Table of Contents
- [New Data-Binding to avoid conflict](https://github.com/urigo/ngmeteor#new-data-binding-to-avoid-conflict)
- [Using Meteor Collections](https://github.com/urigo/ngmeteor#using-meteor-collections)
- [Adding controllers, directives, filters and services](https://github.com/urigo/ngmeteor#adding-controllers-directives-filters-and-services)
- [Creating and inserting template views](https://github.com/urigo/ngmeteor#creating-and-inserting-template-views)
- [Routing](https://github.com/urigo/ngmeteor#routing)
- [Module Injection](https://github.com/urigo/ngmeteor#module-injection)

### New Data-Binding to avoid conflict
To prevent conflicts with Meteor's Blaze live templating engine, ngMeteor has changed the default AngularJS data bindings from <code>{{...}}</code> to <code>[[...]]</code>. For example:

    <div>
        <label>Name:</label>
        <input type="text" ng-model="yourName" placeholder="Enter a name here">
        <hr>
        <h1>Hello [[yourName]]!</h1>
    </div>

### Using Meteor Collections

ngMeteor provides an AngularJS service called $collection, which is a wrapper for [Meteor collections](http://docs.meteor.com/#meteor_collection) to enable reactivity within AngularJS. The $collection service no longer subscribes to a publisher function automatically, so you must explicitly subscribe to a publisher function before calling the $collection service.

    $collection(collection, selector, options)

| Arguments     | Type                                                                      | Description                                                       | Required  |
| :------------ | :------------------------------------------------------------------------ | :---------------------------------------------------------------- | :-------- |
| collection    | [Meteor Collection Object](http://docs.meteor.com/#meteor_collection)     | The Meteor Collection                                             | Yes       |
| selector      | [Mongo Selector (Object or String)](http://docs.meteor.com/#selectors)    | Same as [Meteor Collection Find](http://docs.meteor.com/#find)    | No        |
| options       | Object                                                                    | Same as [Meteor Collection Find](http://docs.meteor.com/#find)    | No        |

The $collection service only has one method, and that is <code>bind</code>, which is used to bind the collection to an Angular model so that you can use it in your scope:

    bind(scope, model, auto)

| Arguments     | Type      | Description                                                                                                                                                                                                                                                              | Required  | Default   |
| :------------ | :-------- | :------------------------------------------------------------------------                                                                                                                                                                                                | :-------- | :-------- |
| scope         | Scope     | The scope the collection will be bound to.                                                                                                                                                                                                                               | Yes       |           |
| model         | String    | The model the collection will be bound to.                                                                                                                                                                                                                               | Yes       |           |
| auto          | Boolean   | By default, changes in the model will not automatically update the collection. However if set to true, changes in the client will be automatically propagated back to the collection. A deep watch is created when this is set to true, which sill degrade performance.  | No        | false     |

Once a collection has been bound using the <code>bind</code> method, the model will have access to the following methods for upserting/removing objects in the collection. If the <code>auto</code> argument as been set to true, then the user will not need to call these methods because these methods will be called automatically whenever the model changes.

| Method                    | Argument  | Type                                  | Description                                                                                                                       |
| :------------             | :------   | :-------------------------            | :-------------                                                                                                                    |
| <code>save(docs)</code>   | docs      | Object or Array of Objects            | Upsert an object into the collection. If no argument is passed, all the objects in the model to the collection will be upserted.  |
| <code>remove(keys)</code> | keys      | _id String or Array of _id Strings    | Removes an object from the collection. If no argument is passed, all the objects in the collection will be removed.               |

For example:

    /**
     * Assume autopublish package is removed so we can work with multiple publisher functions.
     * If insecure package is also removed, then you'll need to define the collection permissions as well.
     **/

    // Define a new Meteor Collection
    Todos = new Meteor.Collection('todos');

    if (Meteor.isClient) {
        ngMeteor.controller("mainCtrl", ['$scope', '$collection',
            function($scope, $collection){

                // Subscribe to all public Todos
                Meteor.subscribe('publicTodos');

                // Bind all the todos to $scope.todos
                $collection(Todos).bind($scope, 'todos');

                // Bind all sticky todos to $scope.stickyTodos
                $collection(Todos, {sticky: true}).bind($scope, 'stickyTodos');

                // todo might be an object like this {text: "Learn Angular", sticky: false}
                // or an array like this [{text: "Learn Angular", sticky: false}, {text: "Hello World", sticky: true}]
                $scope.save = function(todo) {
                    $scope.todos.save(todo);
                };

                $scope.saveAll = function() {
                    $scope.todos.save();
                };

                $scope.toSticky = function(todo) {
                    if (angular.isArray(todo)){
                        angular.forEach(todo, function(object) {
                            object.sticky = true;
                        });
                    } else {
                        todo.sticky = true;
                    }

                    $scope.stickyTodos.save(todo);
                };

                // todoId might be an string like this "WhrnEez5yBRgo4yEm"
                // or an array like this ["WhrnEez5yBRgo4yEm","gH6Fa4DXA3XxQjXNS"]
                $scope.remove = function(todoId) {
                    $scope.todos.remove(todoId);
                };

                $scope.removeAll = function() {
                    $scope.todos.remove();
                };
            }
        ]);
    }

    if (Meteor.isServer) {

        // Returns all objects in the Todos collection with public set to true.
        Meteor.publish('publicTodos', function(){
            return Todos.find({public: true});
        });

        // Returns all objects in the Todos collection with public set to false.
        Meteor.publish('privateTodos', function(){
            return Todos.find({public: false});
        });

    }

<code>bindOne</code> - used to bind the a single model to your scope:

    bindOne(scope, model, id, auto)

| Arguments     | Type      | Description                                                                   | Required  | Default   |
| :------------ | :-------- | :------------------------------------------------------------------------     | :-------- | :-------- |
| scope         | Scope     | The scope the model will be bound to.                                         | Yes       |           |
| model         | String    | The scope property the model will be bound to.                                | Yes       |           |
| id            | String    | The id used to look up the model from the collection                          | Yes       |           |
| auto          | Boolean   | By default, changes in the model will not automatically update the collection. However if set to true, changes in the client will be automatically propagated back to the collection. A deep watch is created when this is set to true, which sill degrade performance.  | No        | false     |


### Adding controllers, directives, filters and services
It is best practice to not use globally defined controllers like they do in the AngularJS demos. Always use the exported package scope ngMeteor as your angular module to register your controller with $controllerProvider. Furthermore, to prevent errors when minifying and obfuscating the controllers, directives, filters or services, you need to use [Dependency Injection](http://docs.angularjs.org/guide/di). For example:

    ngMeteor.controller('TodoCtrl', ['$scope', '$collection',
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

Templates will also be added to the $templateCache of the ngMeteor angular module. To invoke the template in AngularJS you could use ng-view and specify the template in the $templateCache when defining your routes using the $routeProvider or your could use the ng-template directive to render your template like this:

    <ANY ng-template="foo"></ANY>

    <!--Add the ng-controller attribute if you want to load a controller at the same time.-->    
    <ANY ng-template="foo" ng-controller="fooCtrl"></ANY>
    
Templates with names starting with an underscore, for example "_foo", will not be put into the $templateCache, so you will not be able to access those templates using ng-template, ng-include or ng-view.

### Routing
The [ngRoute](http://docs.angularjs.org/api/ngRoute) module developed by the AngularJS team is included in ngMeteor, which will satisfy those with simple routing needs. For example, if you want to call a template called 'foo' and a controller called 'TodoCtrl' when someone lands on your home page you would define your route like this:

    ngMeteor.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
        $routeProvider.when('/',{
          templateUrl: 'foo',
          controller: 'TodoCtrl'
        });
          
        $locationProvider.html5Mode(true);
      }
    ]);

For larger applications with more completed routes, it would be wise to consider using the [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) Meteor package for ngMeteor, which exposes the popular [ui-router](https://github.com/angular-ui/ui-router) module to ngMeteor. For those of you that have grown accustomed to the Meteor methods of routing, ngMeteor is compatible with [Iron Router](https://github.com/EventedMind/iron-router).
    
### Module Injection
If you have a module called myModule, for example:

    myModule = angular.module('myModule',[]);

it can be easily injected into ngMeteor like this:

    ngMeteor.requires.push('myModule');
    
Using this method, additional functionality has been provided to urigo:ngmeteor in the form of separate Meteor packages that expose and inject angular modules into ngMeteor. These packages have been developed by either the ngMeteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) empowers ngMeteor with the [ui-router](https://github.com/angular-ui/ui-router) module.
- [netanelgilad:angular-file-upload](https://github.com/netanelgilad/meteor-angular-file-upload) empowers ngMeteor with [angular-file-upload](https://github.com/nervgh/angular-file-upload) module.
- [davidyaha:ng-grid](https://github.com/davidyaha/meteor-ng-grid) empowers ngMeteor with [ui-grid](https://github.com/angular-ui/ng-grid) module.
- [netanelgilad:angular-sortable-view](https://github.com/netanelgilad/meteor-angular-sortable-view/) empowers ngMeteor with [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view) module.
- [netanelgilad:text-angular](https://github.com/netanelgilad/meteor-textAngular/) empowers ngMeteor with [textAngular](https://github.com/fraywing/textAngular) module.

Feel free to make ngMeteor module smart packages, and please contact [urigo](https://github.com/urigo) if you would like your package to be listed here as well.
Be sure to be compatible with Meteor 0.9.0 and above and it's packaging system!

