[angular-meteor](http://angularjs.meteor.com/tutorial)
======================================================
> The power of Meteor and the simplicity and eco-system of AngularJS

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) <code>curl https://install.meteor.com | /bin/sh</code>
2. Create a new meteor app using <code>meteor create myapp</code> or navigate to the root of your existing app.
4. Install urigo:angular <code>meteor add urigo:angular</code>

## Getting started tutorial
[http://angularjs.meteor.com/tutorial](http://angularjs.meteor.com/tutorial)

## Package 
[urigo:angular](https://atmospherejs.com/urigo/angular)

## Usage
### Table of Contents
- [App initialization](https://github.com/urigo/angular-meteor#app-initialization)
- [New Data-Binding to avoid conflict](https://github.com/urigo/angular-meteor#new-data-binding-to-avoid-conflict)
- [Using Meteor Collections](https://github.com/urigo/angular-meteor#using-meteor-collections)
- [Adding controllers, directives, filters and services](https://github.com/urigo/angular-meteor#adding-controllers-directives-filters-and-services)
- [Creating and inserting template views](https://github.com/urigo/angular-meteor#creating-and-inserting-template-views)
- [Routing](https://github.com/urigo/angular-meteor#routing)
- [User service] (https://github.com/urigo/angular-meteor#User)

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

angular-meteor provides an AngularJS service called $collection, which is a wrapper for [Meteor collections](http://docs.meteor.com/#meteor_collection) to enable reactivity within AngularJS. The $collection service no longer subscribes to a publisher function automatically, so you must explicitly subscribe to a publisher function before calling the $collection service.

    $collection(collection, selector, options)

| Arguments     | Type                                                                      | Description                                                       | Required  |
| :------------ | :------------------------------------------------------------------------ | :---------------------------------------------------------------- | :-------- |
| collection    | [Meteor Collection Object](http://docs.meteor.com/#meteor_collection)     | The Meteor Collection                                             | Yes       |
| selector      | [Mongo Selector (Object or String)](http://docs.meteor.com/#selectors)    | Same as [Meteor Collection Find](http://docs.meteor.com/#find)    | No        |
| options       | Object                                                                    | Same as [Meteor Collection Find](http://docs.meteor.com/#find)    | No        |

<code>bind</code>, which is used to bind the collection to an Angular model so that you can use it in your scope:

    bind(scope, model, auto, publisher)

| Arguments     | Type             | Description                                                                                                                                                                                                                                                              | Required  | Default   |
| :------------ | :--------------- | :------------------------------------------------------------------------                                                                                                                                                                                                | :-------- | :-------- |
| scope         | Scope            | The scope the collection will be bound to.                                                                                                                                                                                                                               | Yes       |           |
| model         | String           | The model the collection will be bound to.                                                                                                                                                                                                                               | Yes       |           |
| auto          | Boolean          | By default, changes in the model will not automatically update the collection. However if set to true, changes in the client will be automatically propagated back to the collection. A deep watch is created when this is set to true, which sill degrade performance.  | No        | false     |
| publisher     | Boolean/String   | By default, bind method will not automatically subscribe to the collection. However if set to true, bind will call Meteor.subscribe on the current collection. you can also set publisher to a string and then bind will call Meteor publish with that string.           | No        | false     |

Once a collection has been bound using the <code>bind</code> method, the model will have access to the following methods for upserting/removing objects in the collection. If the <code>auto</code> argument as been set to true, then the user will not need to call these methods because these methods will be called automatically whenever the model changes.

| Method                    | Argument  | Type                                  | Description                                                                                                                       |
| :------------             | :------   | :-------------------------            | :-------------                                                                                                                    |
| <code>save(docs)</code>   | docs      | Object or Array of Objects            | Upsert an object into the collection. If no argument is passed, all the objects in the model to the collection will be upserted.  |
| <code>remove(keys)</code> | keys      | _id String or Array of _id Strings    | Removes an object from the collection. If no argument is passed, all the objects in the collection will be removed.               |

[More in step 3 of the tutorial](http://angularjs.meteor.com/tutorial/step_03)

For example:

    /**
     * Assume autopublish package is removed so we can work with multiple publisher functions.
     * If insecure package is also removed, then you'll need to define the collection permissions as well.
     **/

    // Define a new Meteor Mongo Collection
    Todos = new Mongo.Collection('todos');

    if (Meteor.isClient) {
        app.controller("mainCtrl", ['$scope', '$collection',
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

[More in step 6 of the tutorial](http://angularjs.meteor.com/tutorial/step_06)

### Subscribe

angular-meteor provides an AngularJS service called $subscribe, which is a wrapper for [Meteor.subscribe](http://docs.meteor.com/#meteor_subscribe) to subscribe the client to a Meteor.publish Method within AngularJS with promises. 

    $subscribe.subscribe(name, subscribeArguments)   
    
Returns a promise when subscription is ready.

    $subscribe.subscribe('todos').then(function(){
                  console.log($scope.todos);
                });


### Adding controllers, directives, filters and services
It is best practice to not use globally defined controllers like they do in the AngularJS demos. Always use the exported package scope angular-meteor as your angular module to register your controller with $controllerProvider. Furthermore, to prevent errors when minifying and obfuscating the controllers, directives, filters or services, you need to use [Dependency Injection](http://docs.angularjs.org/guide/di). For example:

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

Templates will also be added to the $templateCache of the angular-meteor module. To invoke the template in AngularJS you could use ng-view and specify the template in the $templateCache when defining your routes using the $routeProvider or your could use the ng-template directive to render your template like this:

    <ANY ng-template="foo"></ANY>

    <!--Add the ng-controller attribute if you want to load a controller at the same time.-->    
    <ANY ng-template="foo" ng-controller="fooCtrl"></ANY>
    
Templates with names starting with an underscore, for example "_foo", will not be put into the $templateCache, so you will not be able to access those templates using ng-template, ng-include or ng-view.

You can include Meteor templates with <meteor-include src="loginButtons"></meteor-include> (loginButtons is the template name).

    <template name="phones">
      <meteor-include src="loginButtons"></meteor-include>
        <ul>
          <li ng-repeat="phone in phones">
            [[phone.name]]
            <p>[[phone.snippet]]</p>
          </li>
        </ul>
    </template>

### Routing
It would be wise to consider using the [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) Meteor package for angular-meteor, which exposes the popular [ui-router](https://github.com/angular-ui/ui-router) module to angular-meteor. For those of you that have grown accustomed to the Meteor methods of routing, angular-meteor is compatible with [Iron Router](https://github.com/EventedMind/iron-router).

[More in step 5 of the tutorial](http://angularjs.meteor.com/tutorial/step_05)
    
### User
    
angular-meteor support a $user service to bind the current logged in user and it's data.
    
<code>bind</code> - used to bind the current logged in user to your scope:

    bind(scope, model)

| Arguments     | Type      | Description                                                                   | Required  | Default   |
| :------------ | :-------- | :------------------------------------------------------------------------     | :-------- | :-------- |
| scope         | Scope     | The scope the model will be bound to.                                         | Yes       |           |
| model         | String    | The scope property the model will be bound to.                                | Yes       |           |

    $user.bind($scope, 'user');
        
    $user.bind($rootScope, 'user');    
    
[More in step 8 of the tutorial](http://angularjs.meteor.com/tutorial-02/step_08)    

### Additional packages

Using this method, additional functionality has been provided to urigo:angular-meteor in the form of separate Meteor packages that expose and inject angular modules into angular-meteor. These packages have been developed by either the angular-meteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [urigo:angular-ui-router](https://github.com/Urigo/meteor-angular-ui-router) empowers angular-meteor with the [ui-router](https://github.com/angular-ui/ui-router) module.
- [netanelgilad:angular-file-upload](https://github.com/netanelgilad/meteor-angular-file-upload) empowers angular-meteor with [angular-file-upload](https://github.com/nervgh/angular-file-upload) module.
- [davidyaha:ng-grid](https://github.com/davidyaha/meteor-ng-grid) empowers angular-meteor with [ui-grid](https://github.com/angular-ui/ng-grid) module.
- [netanelgilad:angular-sortable-view](https://github.com/netanelgilad/meteor-angular-sortable-view/) empowers angular-meteor with [angular-sortable-view](https://github.com/kamilkp/angular-sortable-view) module.
- [netanelgilad:text-angular](https://github.com/netanelgilad/meteor-textAngular/) empowers angular-meteor with [textAngular](https://github.com/fraywing/textAngular) module.

Feel free to make angular-meteor module smart packages, and please contact [urigo](https://github.com/urigo) if you would like your package to be listed here as well.
Be sure to be compatible with Meteor 0.9.0 and above and it's packaging system!

