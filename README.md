ngMeteor
========
> The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.
> Currently implementing a [Demo Page](http://ng.meteor.com).

## Features for v0.2
* Decouple Meteor.subscribe from $collection service to allow users to subscribe to publishers with a different name to the collection, and also allow multiple subscriptions.
* Allow users to define their own model to attach the $collection service.
* Include method to save all objects in a model to the collection.
* Include method to delete all objects in a model from the collection.
* Include method to allow users to automatically create a three way data bind between model, view and collection.
* Update documentation on $collection service with examples.
* More general method to recompile angular code whenever a template is re-rendered using Handlebar helpers, such as #if and with iron-router, than the current workaround for iron-router.
* Optional: Create ngMeteor generator for Yeoman to allow users to get started more quickly.

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
To prevent conflicts with Handlebars, ngMeteor has changed the default AngularJS data bindings from <code>{{foo}}</code> to <code>[[foo]]</code>. For example:

    <h2>Todo</h2>
    <div ng-controller="TodoCtrl">
      <span>[[remaining()]] of [[todos.length]] remaining</span>
      [ <a href="" ng-click="archive()">archive</a> ]
      <ul class="unstyled">
        <li ng-repeat="todo in todos | filter:todoText">
          <input type="checkbox" ng-model="todo.done" ng-change="saveTodo()">
          <span class="done-[[todo.done]]">[[todo.text]]</span>
        </li>
      </ul>
      <form ng-submit="addTodo()">
        <input type="search" ng-model="todoText" size="30" placeholder="search/add new todo here">
        <input class="btn btn-primary" type="submit" value="add">
      </form>
    </div>

### Using Meteor Collections
> TODO

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

For larger applications with more complexed routes, it would be wise to consider using the [meteor-angular-ui-router](https://github.com/ccll/meteor-angular-ui-router) smart package for ngMeteor, which exposes the popular [ui-router](https://github.com/angular-ui/ui-router) module to ngMeteor. For those of you that have grown accustomed to the Meteor methods of routing, ngMeteor is compatibile with [Iron Router](https://github.com/EventedMind/iron-router).

### Module Injection
If you have a module called myModule, for example:

    myModule = angular.module('myModule',[]);

it can be easily injected into ngMeteor like this:

    ngMeteor.requires.push('myModule');

Using this method, additional functionality has been provided to ngMeteor in the form of separate atmosphere smart packages that expose and inject angular modules into ngMeteor. These packages have been developed by either the ngMeteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [angular-ui-router](https://github.com/ccll/meteor-angular-ui-router) empowers ngMeteor with the [ui-router](https://github.com/angular-ui/ui-router) module.
- [spiderable-ui-router](https://github.com/ccll/meteor-spiderable-ui-router) integrates the Meteor spiderable smart package with the [angular-ui-router](https://github.com/ccll/meteor-angular-ui-router) smart package.
- [angular-bootstrap](https://github.com/ccll/meteor-angular-bootstrap) empowers ngMeteor with the [ui-bootstrap](http://angular-ui.github.io/bootstrap/) framework.
- [ionic](https://github.com/cramrov/meteor-ionic) empowers ngMeteor with the [Ionic Framework](http://ionicframework.com/).
- [angular-leaflet](https://github.com/QaDeS/meteor-angularjs-leaflet) empowers ngMeteor with the [Leaflet](https://github.com/tombatossals/angular-leaflet-directive) directive.
- [angular-nojquery](https://github.com/QaDeS/meteor-angularjs-nojquery) prevents jQuery from interfering with ngMeteor.
- [angular-ui-utlis](https://github.com/pscanf/meteor-angular-ui-utils) empowers ngMeteor with the [ui-utlis](http://angular-ui.github.io/ui-utils/) utiliy package.
- [ngStorage](https://github.com/pscanf/meteor-ngStorage) empowers ngMeteor with the [ngStorage](https://github.com/gsklee/ngStorage) module.

Feel free to make ngMeteor module smart packages, and please contact [loneleeandroo](https://github.com/loneleeandroo) if you would like your package to be listed here as well.
