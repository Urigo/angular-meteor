{{#template name="angular-step08"}}

# Filtering collections

In this step, we'll add a client-side data filtering feature to our app, so that users can check a box to see only incomplete tasks.

We're going to learn how to use Mongo's filtering API.

First, we need to add a checkbox to our HTML:

```html
<!-- add the checkbox to <body> right below the h1 -->
<label class="hide-completed">
  <input type="checkbox" ng-model="$parent.hideCompleted"/>
  Hide Completed Tasks
</label>
```

This checkbox binds to the scope's `hideCompleted` variable.
> We are using `$parent` because it creates a new child scope.

Now, we need to update our `$scope.tasks` query each time `hideCompleted` changes.

### Filtering collection syntax

The query that returns all tasks (the current query looks like that:

```js
Tasks.find({}, { sort: { createdAt: -1 } })
```

and the query to return only the not completed todos looks like that:

```js
Tasks.find({ checked: {$ne: true} }, { sort: { createdAt: -1 } })
```

### Watching the checkbox

So let's create a scope variable that will hold the wanted query and will change together with the checkbox.
Inside our controller:

```js
$scope.$watch('hideCompleted', function() {
  if ($scope.hideCompleted)
    $scope.query = {checked: {$ne: true}};
  else
    $scope.query = {};
});
```

and let's change our `$scope.tasks` definition accordingly:
```js
$scope.tasks = $meteor.collection(function() {
  return Tasks.find($scope.query, {sort: {createdAt: -1}})
});
```

**but we are missing one more thing** - The expression we are sending `$meteor.collection` is a Meteor expression and
**Meteor has to know that the Angular `query` parameter has changed**.

### Connecting Angular bindings to Meteor's reactivity

To make Meteor understand Angular bindings and the other way around, we use [$scope.getReactively](http://angular-meteor.com/api/getReactively) function that turns Angular
scope variables into [Meteor reactive variables](http://docs.meteor.com/#/full/reactivevar_pkg).

So now our definition should look like that:

```js
$scope.tasks = $meteor.collection(function() {
  return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
});
```

Now if you check the box, the task list will only show tasks that haven't been completed.

> To learn more about the [getReactively](http://angular-meteor.com/api/getReactively) feature
> you can try the [advanced tutorial](http://angular-meteor.com/tutorial/step_12).

### One more feature: Showing a count of incomplete tasks

Now that we have written a query that filters out completed tasks, we can use the same query to display a count of the tasks that haven't been checked off. To do this we need to add a scope function and change one line of the HTML.

```js
// Add to scope
$scope.incompleteCount = function () {
  return Tasks.find({ checked: {$ne: true} }).count();
};
```

```html
<!-- display the count at the end of the <h1> tag -->
<h1>Todo List ( {{dstache}} incompleteCount() }} )</h1>
```

{{/template}}
