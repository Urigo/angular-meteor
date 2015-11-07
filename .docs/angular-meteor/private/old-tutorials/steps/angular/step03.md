{{#template name="angular-step03"}}

# Storing tasks in a collection

{{> step03CollectionsIntro}}

Let's update our JavaScript code to get our tasks from a collection instead of a static array:

```js
// simple-todos-angular.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

	// This code only runs on the client
	angular.module("simple-todos",['angular-meteor']);

	angular.module("simple-todos").controller("TodosListCtrl", ['$scope', '$meteor',
	  function($scope, $meteor){

	    $scope.tasks = $meteor.collection(Tasks);

	}]);
}
```

We are using the `$meteor` service to bind our `Tasks` collection to our `$scope.tasks` variable.
Now every change that will happen to each of those objects will be synced in real time across our stack.

When you make these changes to the code, you'll notice that the tasks that used to be in the todo list have disappeared. That's because our database is currently empty &mdash; we need to insert some tasks!

{{> step03InsertingTasksFromConsole}}

{{/template}}
