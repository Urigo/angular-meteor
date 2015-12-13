{{#template name="tutorials.socially.angular1.step_02.md"}}
{{> downloadPreviousStep stepName="step_01"}}

It's time to make our web app dynamic — with Angular 1.

This step is focused on client side Angular 1 tools. The next one will show you the power of Meteor.

# View and Template

In Angular 1, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular 1 refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

{{> DiffBox tutorialName="meteor-angular1-socially" step="2.1" filename="main.html"}}

We replaced the hard-coded party list with the [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat) directive and two Angular 1 expressions:

* The `ng-repeat="party in parties"` attribute in the `li` tag is an Angular 1 repeater directive. The repeater tells Angular 1 to create a `li` element for each party in the list using the `li` tag as the template.
* The expressions wrapped in double-curly-braces ( `{{dstache}}party.name}}` and `{{dstache}}party.description}}` ) will be replaced by the value of the expressions.

We have added a new directive, called `ng-controller`, which attaches the `PartiesListCtrl` controller to the `div` tag. At this point *the expressions in double-curly-braces are referring to our application model, which is set up in our `PartiesListCtrl` controller.*


# Model and Controller

To create our controller and model we start with `PartiesListCtrl` controller and place data in it.

{{> DiffBox tutorialName="meteor-angular1-socially" step="2.2"}}

We declared a controller called `PartiesListCtrl` and registered it in our Angular 1 module app - `socially`.

The data model is now instantiated within the `PartiesListCtrl` controller.

Although the controller is not yet doing very much, it plays a crucial role. By providing context for our data model, the controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, the data, and the logic components as follows:

* The ngController directive, located on the `div` tag, references the name of our controller, `PartiesListCtrl` (located in the JavaScript file `app.js`).
* The `PartiesListCtrl` controller attaches the party data to the `$scope` that was injected into our controller function. This controller scope is available to all bindings located within the `div ng-controller="PartiesListCtrl">` tag.

# ng-annotate

As you may know, when using AngularJS dependency injection, we used strings for [dependency annotations](https://docs.angularjs.org/guide/di#dependency-annotation) that avoids minification problems:

    angular.module('socially').controller('PartiesListCtrl', ['$scope',
      function($scope){
        // ...
    }]);

There is a very popular Angular 1 tool that's called [ng-annotate](https://github.com/olov/ng-annotate) that takes care of that for us so we can write regular code that won't get mangled in minification.

angular-meteor uses that process automatically so you do not need to add those extra definitions and just write your app without minification issues!

So let's change our code to the regular and shorter declaration way:

{{> DiffBox tutorialName="meteor-angular1-socially" step="2.3"}}

and let's add the `ng-strict-di` directive so that if case there is a minification problem, we will find in already in development and not only after minification in production:

{{> DiffBox tutorialName="meteor-angular1-socially" step="2.4"}}

# Summary

You now have a dynamic app that features separate model, view and controller components.

But, this is all client side, which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

Go to [step 3](/tutorial/step_03) to learn how to bind our application to the great power of Meteor.

{{/template}}
