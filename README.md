ngMeteor v0.2
========
> The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart) <code>curl https://install.meteor.com | /bin/sh</code>
2. Install [Meteorite](https://github.com/oortcloud/meteorite#installing-meteorite) <code>npm install -g meteorite</code>
3. Create a new meteor app using <code>meteor create myapp</code> or navigate to the root of your existing app.
4. Install ngMeteor <code>mrt add ngMeteor</code>

## Usage
### Table of Contents
- [New Data-Binding to avoid conflict](https://github.com/loneleeandroo/ngMeteor#new-data-binding-to-avoid-conflict)
- [Using Meteor Collections](https://github.com/loneleeandroo/ngMeteor#using-meteor-collections)
- [Adding controllers, directives, filters and services](https://github.com/loneleeandroo/ngMeteor#adding-controllers-directives-filters-and-services)
- [Creating and inserting template views](https://github.com/loneleeandroo/ngMeteor#creating-and-inserting-template-views)
- [Routing](https://github.com/loneleeandroo/ngMeteor#routing)
- [Module Injection](https://github.com/loneleeandroo/ngMeteor#module-injection)

### New Data-Binding to avoid conflict
To prevent conflicts with Meteor's Blaze live templating engine, ngMeteor has changed the default AngularJS data bindings from <code>{{...}}</code> to <code>[[...]]</code>. For example:

    <div>
        <label>Name:</label>
        <input type="text" ng-model="yourName" placeholder="Enter a name here">
        <hr>
        <h1>Hello [[yourName]]!</h1>
    </div>

### Using Meteor Collections
> If you're upgrading from v0.1 please read this section for changes on using the $collection service.

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

