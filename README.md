ngMeteor
========
> The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.
> Currently implementing a [Demo Page](http://ng.meteor.com).

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart)
<pre><code>curl https://install.meteor.com | /bin/sh</code></pre>
2. Install [Meteorite](https://github.com/oortcloud/meteorite#installing-meteorite)
<pre><code>npm install -g meteorite</code></pre>
3. Install ngMeteor
<pre><code>mrt add ngMeteor</code></pre>


## Usage
### New Data-Binding to avoid conflict
To prevent conflicts with Handlebars, ngMeteor has changed the default AngularJS data bindings from <code>{{foo}}</code> to <code>[[foo]]</code>. For example:

    <h2>Todo</h2>
    <div ng-controller="TodoCtrl">
      <span>[[remaining()]] of [[Todos.length]] remaining</span>
      [ <a href="" ng-click="archive()">archive</a> ]
      <ul class="unstyled">
        <li ng-repeat="todo in Todos | filter:todoText">
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
When adding Meteor collections to a $scope, you can preserve the reactivity of the collection by using the <code>$collection</code> service like this:

    $collection(name, scope, selector, options)

Where the <code>name</code> argument refers to the name of the Meteor Collection, <code>scope</code> refers to the $scope you would like to add the collection to, and the arguments <code>selector</code> and <code>options</code> are the same as they are for [Meteor.Collection.find](http://docs.meteor.com/#find). For example, if I have a Meteor collection called "todos", which I want to add into the scope of my controller, $scope, then I would do this:

    $collection("todos", $scope)

which would create a model called "todos" in $scope, and I would refer to it in my controller using:

    $scope.todos

I would also be able to refer to it in my html using:

    [[todos]]

and use it as if it was an ordinary AngularJS model:

    [[todos.length]]

and it would also work for things like ng-repeat:

    <ul class="unstyled">
      <li ng-repeat="todo in todos">
        <input type="checkbox" ng-model="todo.done">
        <span class="done-[[todo.done]]">[[todo.text]]</span>
      </li>
    </ul>

If you want a model to be accessible across controllers, so that changes made to the model in one controller are reflected immediately in a different controller, you could use the $rootScope:

    $collection("todos", $rootScope)

Furthermore, AngularJS models defined using the <code>$collection</code> service will have access to all the methods available to a native AngularJS model with the addition of the following methods, which allows you to persist changes you have made in the AngularJS model to the Meteor collection:

    $scope.todos.add(data)
    $scope.todos.delete(data)

Where the <code>add</code> method is a replacement for both [Meteor.Collection.insert](http://docs.meteor.com/#insert) and [Meteor.Collection.update](http://docs.meteor.com/#update), which is also considered the persistent version of the AngularJS push method, and the <code>delete</code> method is a replacement for [Meteor.Collection.remove](http://docs.meteor.com/#remove). All changes made will be based on the _id property.

Remember that you must first publish the collection from the server to the client, using the following code on the server, before you can access it on the client if you have removed the autopublish package:

    Meteor.publish("todos", function () {
      return todos.find({});
    });

### Adding controllers, directives, filters and services
It is best practice to not use globally defined controllers like they do in the AngularJS demos. Always use the exported package scope <code>ngMeteor</code> as your angular module to register your controller with $controllerProvider. Furthermore, to prevent errors when minifying and obfuscating the controllers, directives, filters or services, you need to use [Dependency Injection](http://docs.angularjs.org/guide/di). For example:

    ngMeteor.controller('TodoCtrl', ['$scope', '$collection',
      function($scope, $collection) {
        $collection("todos", $scope);
       
        $scope.addTodo = function() {
          $scope.todos.add({text:$scope.todoText, done:false});
          $scope.todoText = '';
        };

        $scope.saveTodo = function(){
          $scope.Todos.add($scope.Todos);
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
            if (!todo.done) $scope.todos.delete(todo);
          });
        };
      }
    ]);

### Creating and inserting template views
A template is defined using the template tags (this could be in a standalone file or included in another file).

    <template name="foo">
      <h1>Hello, World!</h1>
    </template>

A template created this way will be added to the $templateCache of the <code>ngmeteor</code> angular module. To invoke the template, you can use ng-template. This is the recommended way to use ng-template for browser compatability: 

    <ANY ng-template="foo"></ANY>

    <!--Add the ng-controller attribute if you want to load a controller at the same time.-->    
    <ANY ng-template="foo" ng-controller="fooCtrl"></ANY>

It is also possible to use ng-template like this but you will need to be aware of [IE compatability](http://docs.angularjs.org/guide/ie):

    <ng-template name="foo"></ng-template>

    <!--Add the ng-controller attribute if you want to load a controller at the same time.-->    
    <ng-template name="foo" ng-controller="fooCtrl"></ng-template>

Alternatively, you could also use either ng-include (must use single quotations within the double quotations):

    <ANY ng-include=" 'foo' "></ANY>

Or Handlebars:

    {{> foo}}

If you prefer to use [Meteor's default template APIs](http://docs.meteor.com/#templates_api) rather than AngularJS's controllers, directives, filters and services, then you will need to render the template using Handlebars.

### Routing
The [ngRoute](http://docs.angularjs.org/api/ngRoute) module developed by the AngularJS team is included in ngMeteor, which will satisfy those with simple routing needs, however, for larger applications with more complexed routes, it would be wise to consider using the [meteor-angular-ui-router](https://github.com/ccll/meteor-angular-ui-router) smart package for ngMeteor, which exposes the popular [ui-router](https://github.com/angular-ui/ui-router) module to ngMeteor. For those of you that have grown accustomed to the Meteor methods of routing, ngMeteor is ready to use with [Iron Router](https://github.com/EventedMind/iron-router). 

### Additional ngMeteor Modules
Additionally functionality has been provided to ngMeteor in the form of separate atmosphere smart packages that expose and inject angular modules into ngMeteor. These packages have been developed by either the ngMeteor Team and/or by third parties. The following is a non-exhaustive list of these packages:

- [meteor-angular-ui-router](https://github.com/ccll/meteor-angular-ui-router) empowers ngMeteor with the [ui-router](https://github.com/angular-ui/ui-router) module.
- [meteor-angular-bootstrap](https://github.com/ccll/meteor-angular-bootstrap) empowers ngMeteor with the [ui-bootstrap](http://angular-ui.github.io/bootstrap/) module.
- [meteor-ionic](https://github.com/cramrov/meteor-ionic) empowers ngMeteor with the [Ionic Framework](http://ionicframework.com/).


<!---
### Dynamic routing
Routes will automaticlly be created based on a template's name, however, you can override the dynamic routes by manually assigning a route using $routeProvider. The route will load that template and conditionally load a controller with the same name if it exists. You can prevent a template from creating a route by adding a "_" infront of the template name. Based on the URL, this is how you should name your templates:

| URL                               | Template / Controller name     | $routeParams |
| :-------------------------------- | :----------------------------- | :----------- |
| /                                 | index                          |              |
| /page                             | page                           |              |
| /page/post                        | page.post                      |              |
| /page/post/:edit                  | page.post_edit                 | edit         |
| /page/post/:edit/:user            | page.post_edit_user            | edit, user   |
| /page/post/:edit/:user/attachment | page.post_edit_user.attachment | edit, user   |
| No route!                         | _anyName                       |              |

For example, if I wanted a template to show when a user goes to <code>/post/:postId/edit</code>, then my HTML would look like this:

    <head>
      <title>ngMeteor</title>
    </head>

    <body>
      <div ng-view></div>
    </body>

    <template name="post_postId.edit">
      <h1>Your post id is [[postId]]</h1>
    </template>

and my controller would look like this:

    ngMeteor.controller('post_postId.edit', ['$scope', '$routeParams',
      function($scope, $routeParams) {
        $scope.postId = $routeParams.postId;
      }
    ]);

Currently looking at authentication when routing.

### Nested Views
Currently in progress. I am considering using [ui-router](https://github.com/angular-ui/ui-router) or [angular-segment](https://github.com/artch/angular-route-segment).

### Drag and Drog
Currently in progress. I am considering using [angular-dragdrop](https://github.com/codef0rmer/angular-dragdrop)
    
### Touch events via [Hammer.js](https://github.com/EightMedia/hammer.js/)
Within an Angular.js application, allows you to specify custom behaviour on Hammer.js touch events.
Usage, currently as attribute only:

    ng-tap="{expression}"

You can change the default settings for the instance by adding a second attribute with options:

    ng-touch-options="{drag: false, transform: false}"

This is a list of all the supported touch events:

    hold
    tap
    doubletap
    drag
    dragstart
    dragend
    dragup
    dragdown
    dragleft
    dragright
    swipe
    swipeup
    swipedown
    swipeleft
    swiperight
    transform
    transformstart
    transformend
    rotate
    pinch
    pinchin
    pinchout
    touch
    release

### Other Included Angular Modules
<code>ngMeteor</code> includes these Angular modules in the Angular application module, which means that it is ready to use out of the box:
#### [ui-select2](https://github.com/angular-ui/ui-select2)
> This directive allows you to enhance your select elements with behaviour from the select2 library.

This is a basic example of how you would use the module:

    <select ui-select2 ng-model="select2" data-placeholder="Pick a number">
        <option value=""></option>
        <option value="one">First</option>
        <option value="two">Second</option>
        <option value="three">Third</option>
    </select>


### Where should i put my files?
There is no special structure required for ngMeteor besides the rules specified in the [Official Meteor Documentation](http://docs.meteor.com/#structuringyourapp). This is just an example structure to show you where files should generally go, so feel free to change the layout however you want:

```bash
myapp/  
  collections/          # <- definitions of collections and methods on them (could be models/)
  client/
    controllers/
    directives/
    filters/
    lib/                # <- client specific libraries (also loaded first)
      environment.js    # <- configuration of any client side packages
      helpers/          # <- any helpers (handlebars or otherwise) that are used often in view files
    services/
    stylesheets/        # <- css / styl / less files
    views/
      partials/
      <page>.html       # <- the templates specific to a single page
    main.js             # <- basic Meteor.startup code.
    index.html          # <- toplevel html
  lib/                  # <- any common code for client/server. These files are loaded first.
    environment.js      # <- general configuration
    methods.js          # <- Meteor.method definitions
    external/           # <- common code from someone else
  private/              # <- static files, such as images, that are served directly.
  public/               # <- static files, such as images, that are served directly.
  server/
    publications.js     # <- Meteor.publish definitions
    environment.js      # <- configuration of server side packages
  tests/                # <- unit test files (won't be loaded on client or server)
```
-->