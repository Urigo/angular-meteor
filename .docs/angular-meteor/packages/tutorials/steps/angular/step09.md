{{#template name="angular-step09"}}

# Adding user accounts

Meteor comes with an accounts system and a drop-in login user interface that lets you add multi-user functionality to your app in minutes.

To enable the accounts system and UI, we need to add the relevant packages. In your app directory, run the following command:

```bash
meteor add accounts-ui accounts-password
```

In the HTML, right under the checkbox, include the following code to add a login dropdown:

```html
<meteor-include src="loginButtons"></meteor-include>
```

The powerful [meteor-include](http://angular-meteor.com/api/meteor-include) directive let's you add **any Blaze template** into your Angular templates.
We are adding `loginButtons` which is the Blaze template for user authentication flow supplied with the accounts-ui package.

Then, in your JavaScript, add the following code to configure the accounts UI to use usernames instead of email addresses:

```js
// At the bottom of the client code
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
```

Now users can create accounts and log into your app! This is very nice, but logging in and out isn't very useful yet. Let's add two functions:

1. Only display the new task input field to logged in users
2. Show which user created each task

To do this, we will add two new fields to the `tasks` collection:

1. `owner` - the `_id` of the user that created the task.
2. `username` - the `username` of the user that created the task. We will save the username directly in the task object so that we don't have to look up the user every time we display the task.

First, let's add some code to save these fields into the `addTask` function:

```js
$scope.addTask = function(newTask) {
  $scope.tasks.push({
    text: newTask,
    createdAt: new Date(),             // current time
    owner: Meteor.userId(),            // _id of logged in user
    username: Meteor.user().username}  // username of logged in user
  );
};
```

Then, in our HTML, add an `ng-show` directive to only show the form when there is a logged in user:

```html
<form class="new-task"
      ng-submit="addTask(newTask); newTask='';"
      ng-show="$root.currentUser">
  <input ng-model="newTask" type="text"
         name="text" placeholder="Type to add new tasks" />
</form>
```

Finally, add a statement to display the `username` field on each task right before the text:

```html
<span class="text">
  <strong>{{dstache}}task.username}}</strong> - {{dstache}}task.text}}
</span>
```

Now, users can log in and we can track which user each task belongs to. Let's look at some of the concepts we just discovered in more detail.

### Automatic accounts UI

If our app has the `accounts-ui` package, all we have to do to add a login dropdown is include the `loginButtons` template with [meteor-include](http://angular-meteor.com/api/meteor-include) directive.
This dropdown detects which login methods have been added to the app and displays the appropriate controls. In our case, the only enabled login method is `accounts-password`, so the dropdown displays a password field. If you are adventurous, you can add the `accounts-facebook` package to enable Facebook login in your app - the Facebook button will automatically appear in the dropdown.

### Getting information about the logged-in user

In your HTML, you can use the built-in `$root.currentUser` variable to check if a user is logged in and get information about them. For example, `{{dstache}}$root.currentUser.username}}` will display the logged in user's username.

In your JavaScript code, you can use `Meteor.userId()` to get the current user's `_id`, or `Meteor.user()` to get the whole user document.

### Custom templates

You can choose not to use the `accounts-ui` package template and create your own Angular login templates.
You can read more about it in the [chapter about angular-material](http://angular-meteor.com/tutorial/step_18) in the advanced tutorial.

In the next step, we will learn how to make our app more secure by doing all of our data validation on the server instead of the client.
{{/template}}
