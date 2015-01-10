
  <div class="row">
  <div class="col-md-12">
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_05.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_04"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step05.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_04...step_05"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_06"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>

  <div class="col-md-8">
    <h1>Step 5 - Routing & Multiple Views</h1>
  </div>
  <div class="video-tutorial col-md-4">
    <iframe width="300" height="169" src="//www.youtube.com/embed/icfsNTbJU00?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
  </div>

  <do-nothing class="col-md-12">
  <btf-markdown>

In this step, you will learn how to create a layout template and how to build an app that has multiple views by adding routing, using an Angular module called 'ui-router'.

The goals for this step:

* When you will navigate to index.tpl, you will be redirected to index.tpl/parties and the party list appears in the browser.
* When you click on a party link the url changes to one specific to that party and the stub of a party detail page is displayed.

# Dependencies

The routing functionality added by this step is provided by the [ui-router](https://github.com/angular-ui/ui-router) module, which is distributed separately from the core Angular framework.

We will install ui-router with the help of [bower](http://bower.io/).
To add bower functionality to Meteor we are using a Meteor package called [mquandalle:bower](https://atmospherejs.com/mquandalle/bower).

Type in the command line:

    meteor add mquandalle:bower

Then add a new file in the root of your project called 'bower.json' and fill it up with these lines:

__`bower.json`:__

    {
      "name": "socially",
      "version": "0.0.1",
      "dependencies": {
        "angular-ui-router": "0.2.13"
      },
      "private": true
    }

Then add the ui-router as a dependency to our angular app in app.js:

    angular.module('socially',['angular-meteor', 'ui.router']);


# Multiple Views, Routing and Layout Template

Our app is slowly growing and becoming more complex.
Until now, the app provided our users with a single view (the list of all parties), and all of the template code was located in the index.tpl file.
The next step in building the app is to add a view that will show detailed information about each of the parties in our list.

To add the detailed view, we could expand the index.tpl file to contain template code for both views, but that would get messy very quickly.
Instead, we are going to turn the index.tpl template into what we call a "layout template". This is a template that is common for all views in our application.
Other "partial templates" are then included into this layout template depending on the current "route" — the view that is currently displayed to the user.

Application routes in Angular are declared via the [$stateProvider](https://github.com/angular-ui/ui-router/wiki), which is the provider of the $state service.
This service makes it easy to wire together controllers, view templates, and the current URL location in the browser.
Using this feature we can implement deep linking, which lets us utilize the browser's history (back and forward navigation) and bookmarks.


# Template

The $state service is usually used in conjunction with the uiView directive.
The role of the uiView directive is to include the view template for the current route into the layout template.
This makes it a perfect fit for our index.tpl template.

Let's create a new html file called parties-list.tpl and paste the existing list code from index.tpl into it:

__`parties-list.tpl`:__

      </btf-markdown>

<pre><code><span class="xml">    <span class="hljs-tag">&lt;<span class="hljs-title">form</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.name"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.description"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"parties.push(newParty)"</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties/</span></span></span><span class="hljs-expression">{{<span class="hljs-variable">party.</span>_<span class="hljs-variable">id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-value">"</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>

        <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

    <btf-markdown>


The code is almost the same except for this one change:

- Added a link to the parties name display (that link will take us the that party's detailed page)

## Meteor templates

HTML files in a Meteor application are treated quite a bit differently from a server-side framework.
Meteor scans all the HTML files in your directory for three top-level elements: HEAD, BODY, and TEMPLATE.
The head and body sections are separately concatenated into a single head and body, which are transmitted to the client on initial page load.

Meteor converts both the templates and body content and generates a client-side JavaScript file (bundle-time, with htmlJS) and makes the template available under the Template namespace.
It's a really convenient way to ship HTML templates to the client.

Now let's go back to index.html and replace the content with the ui-view directive:

__`index.html`:__

</btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">base</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/"</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">head</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-title">body</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-app</span>=<span class="hljs-value">"socially"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">h1</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties"</span>&gt;</span>Home<span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">h1</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ui-view</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>

<span class="hljs-tag">&lt;/<span class="hljs-title">body</span>&gt;</span>
</code></pre>

    <btf-markdown>
Notice we did 2 things:

1. replaced all the content with ui-view (that will be responsible of including the right content according to the current url)
2. Added an h1 header with a link to the main parties page
3. We added base tag the head (required when using HTML5 location mode)

Now we can delete the index.tpl file which we don't use anymore.

Now let's add a placeholder to the new party details page.
Create a new html file called party-details.tpl and paste the following code in:

__`party-details.tpl`:__

        </btf-markdown>

     <pre><code>   Here you will see <span class="hljs-operator">the</span> details <span class="hljs-operator">of</span> party <span class="hljs-built_in">number</span>: {{ partyId }}
     </code></pre>

    <btf-markdown>

We will get to it later on.


# Routes definition

Now let's configure our routes.
Add this config code in app.js, after the angular app has been defined:

    angular.module("socially").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
      function($urlRouterProvider, $stateProvider, $locationProvider){

        $locationProvider.html5Mode(true);

        $stateProvider
          .state('parties', {
            url: '/parties',
            templateUrl: 'parties-list.tpl',
            controller: 'PartiesListCtrl'
          })
          .state('partyDetails', {
            url: '/parties/:partyId',
            templateUrl: 'party-details.tpl',
            controller: 'PartyDetailsCtrl'
          });

          $urlRouterProvider.otherwise("/parties");
    }]);


Using the Angular app's .config() method, we request the $stateProvider to be injected into our config function and use the state method to define our routes.

Our application routes are defined as follows:

* ('/parties'): The parties list view will be shown when the URL hash fragment is /parties. To construct this view, Angular will use the parties-list.tpl template and the PartiesListCtrl controller.
* ('/parties/:partyId'): The party details view will be shown when the URL hash fragment matches '/parties/:partyId', where :partyId is a variable part of the URL. To construct the party details view, Angular will use the party-details.tpl template and the PartyDetailsCtrl controller.
* $urlRouterProvider.otherwise("/parties"): triggers a redirection to /parties when the browser address doesn't match either of our routes.
* $locationProvider.html5Mode(true): Sets the url to look like a regular one. more about it [here](https://docs.angularjs.org/guide/$location#hashbang-and-html5-modes).

Note the use of the :partyId parameter in the second route declaration.
The $state service uses the route declaration — '/parties/:partyId' — as a template that is matched against the current URL.
All variables defined with the : notation are extracted into the $stateParams object.

# Controllers

As you might have seen we removed the controller definition from the ng-controller directive in the index.tpl and moved it into the routes definitions.

But we still need to define our PartyDetailsCtrl controller.
Add this code under the existing controller:

    angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams',
      function($scope, $stateParams){

        $scope.partyId = $stateParams.partyId;

    }]);


Now we have all in place.  Run the app and notice a few things:

* Click on the link in the name of a party - notice that you moved into a different view and that the party's id appears both in the url in the browser and both in the template.
* Click back - you are back to the main list. this is because of ui-router's integration with the browser's history.
* Try to put arbitrary text in the url - something like http://localhost/strange-url  .  you are supposed to be automatically redirected to the main parties list.


# Summary

With the routing set up and the parties list view implemented, we're ready to go to the next step to implement the party details view.


        </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_04"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step05.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_04...step_05"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_06"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>

