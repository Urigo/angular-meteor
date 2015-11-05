{{#template name="angular-step02"}}
# Defining views with templates

To turn our Meteor app into Angular compatible, we need to add the [angular-meteor package](http://angular-meteor.com/) by typing the following
command into your command line:

    meteor add urigo:angular


To start working on our todos list app, let's replace the code of the default starter app with the code below. Then we'll talk about what it does.

```html
<!-- simple-todos-angular.html -->
<head>
  <title>Todo List</title>
</head>

<body ng-app="simple-todos"
      ng-include="'todos-list.ng.html'"
      ng-controller="TodosListCtrl">
</body>
```

```js
// simple-todos-angular.js
if (Meteor.isClient) {

	// This code only runs on the client
	angular.module("simple-todos",['angular-meteor']);

	angular.module("simple-todos").controller("TodosListCtrl", ['$scope',
	  function($scope){

      $scope.tasks = [
        { text: "This is task 1" },
        { text: "This is task 2" },
        { text: "This is task 3" }
      ];

	}]);
}
```

To write Angular templates, we need to name our files with a `.ng.html` suffix.

Create a new file named `todos-list.ng.html` and place it on the root folder:

```html
<!-- todos-list.ng.html -->
<div class="container">
  <header>
    <h1>Todo List</h1>
  </header>

  <ul ng-repeat="task in tasks">
    <li>{{dstache}}task.text}}</li>
  </ul>
</div>
```

In our browser, the app should look pretty much like this:

> #### Todo List
> - This is task 1
> - This is task 2
> - This is task 3

Now let's find out what all these bits of code are doing!

### Angular templates in Meteor

The [angular-meteor package](http://angular-meteor.com/) parses all of the `.ng.html` files in your app folder and puts them in Angular's template cache with the id of their full path.

So, for example, when a file is named `my-angular-template.ng.html` is placed in the `client` folder, it will be available for `ng-include` or `ui-router` with the name `client/my-angular-template.ng.html`.

### Adding logic and data to templates

All of the code in your `ng.html` files is compiled with Angular. Angular binds the data into our templates just like any other Angular app.

In the next step, we will see how we can use the $meteor service bind our scope data to a database collection.

### HTML files in Meteor define templates

Meteor parses all of the regular .HTML files in your app folder and identifies three top-level tags: **&lt;head>**, **&lt;body>**, and **&lt;template>**.

Everything inside any &lt;head> tags is added to the `head` section of the HTML sent to the client, and everything inside &lt;body> tags is added to the `body` section, just like in a regular HTML file.

Everything inside &lt;template> tags is compiled into Meteor _templates_, which can be included inside HTML with `{{dstache}}> templateName}}` or referenced in your JavaScript with `Template.templateName`.

All of the code in your regular .HTML files is compiled with [Meteor's Spacebars compiler](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md).

{{> addingCSS}}

{{/template}}
