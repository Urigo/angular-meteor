{{#template name="tutorial.step_18.md"}}
{{> downloadPreviousStep stepName="step_17"}}


In this step we will consider switching from *Twitter Bootstrap* to [*angular-material*](https://material.angularjs.org/#/).

Angular-material is an AngularJS implementation of Google's [Material Design specifications](http://www.google.com/design/spec/material-design/introduction.html). Material Design is a mobile-first design language used in many new Google's applications, especially on the Android platform.

To start, first we have to remove bootstrap from our application. Type in the console:

    meteor remove twbs:bootstrap

Now we have to add the angular-material Meteor package:

    meteor add angular:angular-material

Next, we want to inject the angular-material module into our Angular application. Edit your `client/lib/app.js` and add `ngMaterial`:

{{> DiffBox tutorialName="angular-meteor" step="18.1"}}

That's it, now we can use angular-material in our application layout. 

Angular-material uses declarative syntax, i.e. directives, to utilize Material Design elements in HTML documents. 

First we want to change our `index.html` to make use of the flex grid layout provided by Material Design. So, change your `client/index.html` to look like this:

{{> DiffBox tutorialName="angular-meteor" step="18.2"}}

You can see we use `layout="column"` in the `body` tag, which tells angular-material to lay all inner tags of `body` vertically.

Next, we use the handy `md-toolbar` directive as a wrapper for our app's toolbar.
We tell it to shrink on vertical scroll with `md-scroll-shrink` attribute and to lay inner elements in a row.

We also tell it `layout-align="start center"` to lay inner elements at `start` of the primary direction (row), meaning element should start at the left edge, and lay them at `center` of the secondary direction (column), so they are stacked centrally in the vertical direction.
We also tell it to put padding around all inner elements with `layout-padding`.

Inside the `md-toolbar` you see we used

    <span flex></span>

element which is actually a separator blank element which is used to fill all the available blank space between the first and third element in the toolbar.

So, now we have a link to Parties to the left, a span to fill all space, and a login button.
Element layout flex grid is very simple and intuitive in angular-material and you can read all about it [here](https://material.angularjs.org/#/layout/grid).

Next, we need to convert our parties list and party detail views to angular-material. 
First, replace the code in your `client/views/parties-list.ng.html` with this code:

{{> DiffBox tutorialName="angular-meteor" step="18.3"}}

What did we do:

* Wrapped everything into the `md-content` tag
* Replaced all the buttons with `md-button` tags
* Wrapped form inputs into `md-input-container` tags which enable the Material Design style labels for inputs
* Added material design Icons

## Material Design Icons

One new thing we also have to add is usage of Material Design icon set. Google provides free icons for Material Design. You can install it by typing: 

    meteor add planettraining:material-design-icons

We have to define the `$mdIconProvider` in the `client/lib/app.js`. Insert these lines after the `angular.module` declaration:

{{> DiffBox tutorialName="angular-meteor" step="18.4"}}

You don't have to define all these icon sets.
You just need to define those you need to use.
You can see a full list of available icons [here](http://google.github.io/material-design-icons/).
You can see in the view code above that to use icons you write:

    <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>

in the `md-svg-icon` attribute you list `<iconset>:<icon_name>` in our case `content:ic_clear_24px`. 

Now, replace the code in the `client/view/party-details.ng.html` with the following code:

{{> DiffBox tutorialName="angular-meteor" step="18.5"}}

Here, as you can see a specific type of button used by angular-material. We have a link button:

    <md-button ng-href="/parties">Cancel</md-button>

Angular-Material makes a regular button that points to a link using `ng-href`.

## Custom Angular forms and Accounts-UI Material Design

Next, we need to make our users management pages use Material Design. 

To do that we are going to define our accounts routes manually and use [angular-meteor's auth methods](/api/auth) in our code.

First we want to remove the Meteor's login button from the toolbar and insert our custom buttons. So, open `client/index.html` and remove the following code from the toolbar:

    <div class="navbar-right navbar-text">
      <blaze-template name="loginButtons"></blaze-template>
    </div>

and replace it with:

{{> DiffBox tutorialName="angular-meteor" step="18.6"}}

Now show `Login` and `Sign up` buttons when the user is not logged in, and we show user name and `Logout` button when the user is logged in.

Having created these buttons we need to assign them corresponding routes as referenced in the `ng-href` attributes of our buttons.

Open the `client/routes.js` and insert following routes below the `$stateProvider` line, and above the existing routes:

{{> DiffBox tutorialName="angular-meteor" step="18.7"}}

* controllerAs -
First thing of note here is that we're using `controllerAs` parameter in the route definition. This gives an alias to `$scope` and many other benefits. For detailed information, read [this article](http://toddmotto.com/digging-into-angulars-controller-as-syntax/). You will see later how we use it.
* Routes -
Second thing is in the `logout` route. We use a `resolve` parameter to define a sort of inline action for this route, as there is not too much logic associated with it, and there is no template. We need this route to log the user out of the system and redirect to home page. So we use `$meteor.logout()` method which returns a promise, and on successful logout we redirect the user to the home page, i.e. `parties` state. On failure, we log an error to the browser console.
For each of our routes we have declared a template and a controller.

So, let's go ahead and create them. Create a subfolder `users` in the `client/` folder, and in the `users` subfolder create subfolders `controllers`, and `views`. We now need to create a controller and a view for each of our routes.


Create a file `client/users/controllers/login.js`. Paste the following code:

{{> DiffBox tutorialName="angular-meteor" step="18.8"}}

Now, instead of using $scope, we're using *controller as* syntax, so we declare a variable `vm` and assign `this` to it.
From now on, each `$scope.` variable or method will be declared as `vm.` variable or method.

We created a `credentials` object containing email and password that will be passed to us from the view. We created a `login` method that will execute the user log in.

You can see a list of API methods for users management provided by `angular-meteor` [here](/api/auth).

Just as we did in the `logout` route, here we utilize an `angular-meteor` method `$meteor.loginWithPassword()` which takes two arguments

1. username or email
2. password

It returns a promise, and on success we redirect the user `parties` state, or assign error message to our `vm.error` property of the controller.

Now create a view file with login form in `client/users/views` folder and name it `login.ng.html`. Paste the following code:

{{> DiffBox tutorialName="angular-meteor" step="18.9"}}

In our router file, we declared the login route controller to be `LoginCtrl` and a `controllerAs` parameter to be `lc`.

This is an alias for our controller and it corresponds to the `vm` variable in our controller code.
So to address all variables/objects/methods of our controller, we prefix them with `lc.`

In our view. You can see in the view that we use `lc.error`, `lc.credentials`, and `lc.login()`.

The procedure is the same for the `register` and `resetpw` routes, so now you create `client/users/controllers/register.js` and paste following code into it: 

{{> DiffBox tutorialName="angular-meteor" step="18.10"}}
      
Create a file `client/users/views/register.ng.html` and paste the following code into it:

{{> DiffBox tutorialName="angular-meteor" step="18.11"}}

Create a file `client/users/controllers/reset.js` and paste the following code into it: 

{{> DiffBox tutorialName="angular-meteor" step="18.12"}}

And, finally, create a corresponding view `client/users/views/reset-password.ng.html` and paste the following into it:

{{> DiffBox tutorialName="angular-meteor" step="18.13"}}

# Summary

In this chapter we two main things:

1. How to work with angular-material-design in our angular-meteor app
2. How to create custom Angular forms for our application's auth

I hope one of you will create an accounts-ui package based on that code and will save us all tons of code!

{{/template}}
