ngMeteor
========
> The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.

## Quick start
1. Install [Meteor](http://docs.meteor.com/#quickstart)
<pre><code>curl https://install.meteor.com | /bin/sh</code></pre>
2. Install [Meteorite](https://github.com/oortcloud/meteorite#installing-meteorite)
<pre><code>npm install -g meteorite</code></pre>
3. Install ngMeteor (Not ready yet, i haven't added the package to Atmosphere)
<pre><code>mrt add ngMeteor</code></pre>

## Recommended Packages
<code>ngMeteor</code> has no dependencies, however here is a list of recommended packages that work well with it:
#### Coffeescript: 
> Javascript dialect with fewer braces and semicolons 

<pre><code>meteor add coffeescript</code></pre>

#### Stylus: 
> Expressive, dynamic, robust CSS. 

<pre><code>meteor add stylus</code></pre>


## Usage
### Partial templates
A template is defined using the template tags (this could be in a standalone .html or included in another .html)

    <template name="partial">
      <h1>Hello, World!</h1>
    </template>

To invoke the template, you can use either AngularJS (must use single quotations within the double quotations):
    
    <div ng-include="'partial.html'"></div>

Or Handlebars:

    {{> partial}}

### New Data-Binding to avoid conflict
To prevent conflicts with Handlebars, ngMeteor has changed the default AngularJS data bindings from <code>{{foo}}</code> to <code>[[foo]]</code>. For example:

    <h2>Todo</h2>
    <div ng-controller="TodoCtrl">
      <span>[[remaining()]] of [[todos.length]] remaining</span>
      [ <a href="" ng-click="archive()">archive</a> ]
      <ul class="unstyled">
        <li ng-repeat="todo in todos">
          <input type="checkbox" ng-model="todo.done">
          <span class="done-[[todo.done]]">[[todo.text]]</span>
        </li>
      </ul>
      <form ng-submit="addTodo()">
        <input type="text" ng-model="todoText" size="30" placeholder="add new todo here">
        <input class="btn-primary" type="submit" value="add">
      </form>
    </div>

### Adding controllers, directives, filters and services
Use the exported package scope <code>ngMeteor</code> as your angular module.
For example:

    ngMeteor.controller('TodoCtrl', function($scope) {
      $scope.todos = [
        {text:'learn angular', done:true},
        {text:'build an angular app', done:false}];
     
      $scope.addTodo = function() {
        $scope.todos.push({text:$scope.todoText, done:false});
        $scope.todoText = '';
      };
     
      $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
          count += todo.done ? 0 : 1;
        });
        return count;
      };
     
      $scope.archive = function() {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
          if (!todo.done) $scope.todos.push(todo);
        });
      };
    });
    
### Touch events via Hammerjs
Within an Angular.js application, allows you to specify custom behaviour on Hammer.js touch events.
Usage, currently as attribute only:

    ng-tap="{expression}"

You can change the default settings for the instance by adding a second attribute with options:

    ng-touch-options="{drag: false, transform: false}"
    
### Where should i put my files?
There is no special structure required for ngMeteor besides the rules specified in the [Official Meteor Documentation](http://docs.meteor.com/#structuringyourapp). This is just an example structure to show you where files should generally go, so feel free to change the layout however you want:

```bash
myapp/  
  collections/              # <- definitions of collections and methods on them (could be models/)
  client/
    controllers/
    directives/
    filters/
    lib/                    # <- client specific libraries (also loaded first)
      environment.js        # <- configuration of any client side packages
      helpers/              # <- any helpers (handlebars or otherwise) that are used often in view files
    services/
    stylesheets/            # <- css / styl / less files
    views/
      partials/
      <page>.html           # <- the templates specific to a single page
      <page>.js             # <- and the JS to hook it up
    main.js                 # <- subscriptions, basic Meteor.startup code.
    index.html              # <- toplevel html
  lib/                      # <- any common code for client/server. Note: files in lib folders are loaded first.
    environment.js          # <- general configuration
    methods.js              # <- Meteor.method definitions
    external/               # <- common code from someone else
  private/                  # <- static files, such as images, that are served directly.
  public/                   # <- static files, such as images, that are served directly.
  server/
    publications.js         # <- Meteor.publish definitions
    environment.js          # <- configuration of server side packages
  tests/                    # <- unit test files (won't be loaded on client or server)
```
