{{#template name="angular-step05"}}

# Checking off and deleting tasks

Until now, we have only interacted with a collection by inserting documents. Now, we will learn how to update and remove them.

Let's add two elements to our `task` template, a checkbox and a delete button:

```html
<!-- replace the existing task template with this code -->
<li ng-class="{'checked': task.checked}">
  <button class="delete" ng-click="tasks.remove(task)">&times;</button>

  <input type="checkbox" ng-model="task.checked" class="toggle-checked" />

  <span class="text">{{dstache}}task.text}}</span>
</li>
```

### Update

We simply bind the `checked` state of each task to a checkbox with Angular. Then Meteor takes care of saving and syncing the state across all clients without any extra code.

### Delete

$meteor.collection gives us a simple helper method called `remove`. That method can take an object or an id of an object and will remove it from the database.

### Classes

If you try checking off some tasks after adding all of the above code, you will see that checked off tasks have a line through them.

Here we bind the checked state of a task to a class with `ng-class`:

```html
<li ng-class="{'checked': task.checked}">
```

With this code, if the `checked` property of a task is `true`, the `checked` class is added to our list item. Using this class, we can make checked-off tasks look different in our CSS. 
{{/template}}
