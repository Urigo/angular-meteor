
  <div class="row">
    <div class="col-md-12">
        <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_02.tpl"
           class="btn btn-default btn-lg improve-button">
          <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
        </a>
        <ul class="btn-group tutorial-nav">
          <a href="/tutorial/step_01"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
          <a href="http://socially-step02.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
          <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_01...step_02"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
          <a href="/tutorial/step_03"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
        </ul>
    </div>

    <div class="col-md-8">
      <h1>Step 2</h1>
    </div>
    <div class="video-tutorial col-md-4">
      <iframe width="300" height="169" src="//www.youtube.com/embed/dN2rc-z_pxQ?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
    </div>

    <do-nothing class="col-md-12">
    <btf-markdown>

Now it's time to make the web page dynamic — with AngularJS.

This step will still be focusing on client side Angular tools. The next one will show you how to get the power of Meteor.

There are many ways to structure the code for an application.
For Angular apps, we encourage the use of the Model-View-Controller (MVC) design pattern to decouple the code and to separate concerns.
With that in mind, let's use a little Angular and JavaScript to add model, view, and controller components to our app.

Goals for this step:

* The list of three parties is now generated dynamically from data in the model of the client


# View and Template

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

The view component is constructed by Angular from this template:

__`index.tpl`:__

      </btf-markdown>
<pre><code><span class="xml">
<span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-controller</span>=<span class="hljs-value">"PartiesListCtrl"</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties"</span>&gt;</span>
      </span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml">
      <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span></span>
</code></pre>
      <btf-markdown>
We replaced the hard-coded party list with the [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat) directive and two Angular expressions:

* The ng-repeat="party in parties" attribute in the li tag is an Angular repeater directive. The repeater tells Angular to create a li element for each party in the list using the li tag as the template.
* The expressions wrapped in double-curly-braches ( {{party.name}} and {{party.description}} ) will be replaced by the value of the expressions.

We have added a new directive, called ng-controller, which attaches the PartiesListCtrl controller to the div tag. At this point:

* The expressions in double-curly-braches ( {{party.name}} and {{party.description}} ) denote bindings, which are referring to our application model, which is set up in our PartiesListCtrl controller.


# AngularJS app

Now we are going to create our own AngularJS client app with client controller and model.

First, let's create our app.

Create a new app.js file.  now you can see another example of Meteor's power and simplicity - no need to include this file anywhere. Meteor will take care of it by going through all the files in the folder and including them automatically.

But Meteor's goal is to break down the barrier between client and server, and the code you write runs everywhere! (more on that later).
But we need Angular's power only in the client side, so how can we do that?

There are a few ways to tell Meteor to run a code only on the client/server/phone side, let's start with the simplest way - Meteor.isClient variable.

__`app.js`:__

      if (Meteor.isClient) {

      }

Now anything that will happen inside this if statement will run only on the client side.

So let's continue with starting our AngularJS application, we will call it "socially":

__`app.js`:__

      if (Meteor.isClient) {
        angular.module('socially',['angular-meteor']);
      }

And name our application in the ng-app directive in index.html:

      </btf-markdown>

<pre><code>
&lt;<span class="hljs-operator">div</span> ng-app=<span class="hljs-string">"socially"</span> ng-<span class="hljs-built_in">include</span>=<span class="hljs-string">"'index.tpl'"</span>&gt;&lt;/<span class="hljs-operator">div</span>&gt;
</code></pre>
      <btf-markdown>


What we did here is to declare a new angular module named 'socially' and making it dependant on the 'angular-meteor' module (that we included in the first step).

Then we told our application to start our angular module on startup.


# Model and Controller

Now let's create our PartiesListCtrl controller and place data in it.


__`app.js`:__

      if (Meteor.isClient) {
        angular.module('socially',['angular-meteor']);

        angular.module("socially").controller("PartiesListCtrl", ['$scope',
          function($scope){

            $scope.parties = [
              {'name': 'Dubstep-Free Zone',
                'description': 'Can we please just for an evening not listen to dubstep.'},
              {'name': 'All dubstep all the time',
                'description': 'Get it on!'},
              {'name': 'Savage lounging',
                'description': 'Leisure suit required. And only fiercest manners.'}
            ];

         }]);
      }


Here we declared a controller called PartiesListCtrl and registered it in our AngularJS module app, 'socially'.
The controller is simply a constructor function that takes a $scope parameter.

The data model (a simple array of parties in object literal notation) is now instantiated within the PartiesListCtrl controller.

Although the controller is not yet doing very much, it plays a crucial role. By providing context for our data model, the controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, data, and logic components as follows:

* The ngController directive, located on the body tag, references the name of our controller, PartiesListCtrl (located in the JavaScript file app.js).

* The PartiesListCtrl controller attaches the party data to the $scope that was injected into our controller function. This scope is a prototypical descendant of the root scope that was created when the application was defined. This controller scope is available to all bindings located within the div ng-controller="PartiesListCtrl"> tag.

# Scope

The concept of a scope in Angular is crucial. A scope can be seen as the glue which allows the template, model and controller to work together. Angular uses scopes, along with the information contained in the template, data model, and controller, to keep models and views separate, but in sync. Any changes made to the model are reflected in the view; any changes that occur in the view are reflected in the model.

To learn more about Angular scopes, see the [angular scope documentation](https://docs.angularjs.org/api/ng/type/$rootScope.Scope).


# Experiments

Add another binding to index.tpl. For example:

</btf-markdown>

<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>Total number of parties: </span><span class="hljs-expression">{{<span class="hljs-variable">parties.length</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>

<btf-markdown>

Create a new model property in the controller (inside app.js) and bind to it from the template. For example:

      $scope.name = "World";

Then add a new binding to index.tpl:

</btf-markdown>
<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>Hello, </span><span class="hljs-expression">{{<span class="hljs-variable">name</span>}}</span><span class="xml">!<span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>
<btf-markdown>

Verify that it says "Hello, World!".

Create a repeater in index.tpl that constructs a simple table:

      </btf-markdown>

<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">table</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">tr</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">th</span>&gt;</span>row number<span class="hljs-tag">&lt;/<span class="hljs-title">th</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">tr</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">tr</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"i in [0, 1, 2, 3, 4, 5, 6, 7]"</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">td</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">i</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">td</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">tr</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">table</span>&gt;</span></span>
      </code></pre>
        <btf-markdown>

Now, make the list 1-based by incrementing i by one in the binding:

        </btf-markdown>
<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">table</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">tr</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">th</span>&gt;</span>row number<span class="hljs-tag">&lt;/<span class="hljs-title">th</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">tr</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">tr</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"i in [0, 1, 2, 3, 4, 5, 6, 7]"</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">td</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">i</span>+1}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">td</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">tr</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">table</span>&gt;</span></span>
      </code></pre>
      <btf-markdown>

Extra points: try and make an 8x8 table using an additional ng-repeat.

# Summary

You now have a dynamic app that features separate model, view, and controller components.

But, this is all client side, which is nice for tutorials, but in a real application we need to save the data in a DB on the server and sync all the clients with it.

So, let's go to step 3 to learn how to bind ourselves to the great power of Meteor.

    </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_01"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step02.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_01...step_02"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_03"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>
