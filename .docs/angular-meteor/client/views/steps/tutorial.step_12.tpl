
  <div>
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_12.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step12.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_11...step_12"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_13"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

    <div class="col-md-8">
      <h1>Step 12 - Search, sort, pagination and reactive vars</h1>
    </div>
    <div class="video-tutorial col-md-4">
      <iframe width="300" height="169" src="//www.youtube.com/embed/8XQI2XpyH18?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
    </div>

    <do-nothing class="col-md-12">
  <btf-markdown>


Now we are dealing with a few parties.
But we need to support also a large number of parties.

In that case, we want to have pagination support.

With pagination we can break the array of parties down to pages so the user won't have to scroll down to find a party,
but also and even more important, we can fetch only a few parties at a time instead of all the parties collection for better performance.

The interesting thing about pagination is that it is dependent on the filters we want to put on top of the collection, for example,
if we are in page 3, but we change how we sort the collection, we should get different results, same thing with search - if we start
a search, there might be not enough results for 3 pages.

For AngularJS developers, this chapter will show how powerful Meteor is.
In the official AngularJS tutorial, we add sorting and search the works only on the client side, which in real world scenarios are not so helpful.
Now, in this chapter we are going to perform a real-time search, sort and paginate that will run all the way to the server.

# angular-meteor pagination support

What we want to achieve with angular-meteor is server-based reactive pagination.
That is no simple task, but using the angular-meteor it could make your life a lot simpler.

To achieve server-based reactive pagination we need to have support for pagination in the server as well as in the client.
That means that our publish function for the parties collection would have to change and also the way that we subscribe to that publication.
So first let's take care of our server-side.

In our parties.js file in the server directory we are going to add the 'options' variable to the publish method like this:

    Meteor.publish("parties", function (options) {
      return Parties.find({
        $or:[
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]},
          {$and:[
            {owner: this.userId},
            {owner: {$exists: true}}
          ]}
        ]}, options);
    });

Now our publish method receives an options arguments which we then pass to the Parties.find() function call.
This will allow us to send arguments to the find function's modifier right from the subscribe call. The options object can
contain properties like `skip`, `sort` and `limit` which we will shortly use ourselves - [Collection Find](http://docs.meteor.com/#/full/find).

Let's get back to our client code. We now need to change our subscribe call with options we want to set for pagination.
What are those parameters that we want to set on the options argument? That is a good question. In order to have pagination in our
parties list we will need to save the current page, the number of parties per page and the sort order. So let's add these parameters to our scope
in the top of the controller in client/controllers/partiesList.js file.

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };

That's cool, but let's do something with these variables except defining them. So where we want to use them is when we call the subscribe method.
But right now, we are subscribing to the collection in the short form which doesn't get parameters:

    $scope.parties = $meteor.collection(Parties).subscribe('parties');

So first we need to add the [$meteor.subscribe](http://angularjs.meteor.com/api/subscribe) service and call it separately:

    $scope.parties = $meteor.collection(Parties);

    $meteor.subscribe('parties');

Now let's send the parameters in the options object:

    $meteor.subscribe('parties', {
      limit: parseInt($scope.perPage),
      skip: parseInt(($scope.page - 1) * $scope.perPage),
      sort: $scope.sort
    });

So we built an object that contains 3 properties:

* limit - how many parties to send per page
* skip  - the number of parties we want to start with which is the current page minus one times the parties per page
* sort  - the sorting of the collection in [MongoDB syntax](http://docs.mongodb.org/manual/reference/method/cursor.sort/)

Now we also need to add the sort modifier to the way we get the collection data from the minimongo.
That is because the sorting is not saved when the data is sent from the server to the client.
So to make sure our data is sorted also on the client need to defined is also in the parties collection.
To do that we are going to replace the 'Parties' collection parameter with a [cursor](http://docs.meteor.com/#/full/mongo_cursor) for that parties collection:

    $scope.parties = $meteor.collection(function() {
      return Parties.find({}, {
        sort : $scope.sort
      });
    });


# pagination directive

Now we need a UI to change and move between the pages.

In AngularJS's eco system there are a lot of directive for handling pagination.

Our personal favorite is [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination).

To add the directive add it's Meteor package to the project:

    meteor add angularutils:pagination

Add it as a dependency to our Angular app in app.js:

    angular.module('socially',['angular-meteor', 'ui.router', 'angularUtils.directives.dirPagination']);


Now let's add the directive in parties-list.ng.html , change the ng-repeat of parties to this:

  </btf-markdown>

    <pre><code>&lt;li <span class="hljs-variable">dir-paginate=</span><span class="hljs-string">"party in parties | itemsPerPage: perPage"</span> <span class="hljs-variable">total-items=</span><span class="hljs-string">"partiesCount.count"</span>&gt;
    </code></pre>

      <btf-markdown>

and after the UL closes add this directive:

      </btf-markdown>

    <pre><code>&lt;dir-pagination-controls <span class="hljs-function_start"><span class="hljs-keyword">on</span></span>-page-change=<span class="hljs-string">"pageChanged(newPageNumber)"</span>&gt;&lt;/dir-pagination-controls&gt;
    </code></pre>

      <btf-markdown>

as you can see, dir-paginate list takes the number of objects in a page (that we defined before) but also takes the total number items (we will get to that soon).
With this bindings it calculates what buttons of pages it should display inside the dir-pagination-controls directive.

On the dir-pagination-controls directive there is a method on-page-change and there we can call our own function.
so we call 'pageChanged' function with the new selection as a parameter.

let's create the pageChanged function inside the partiesList controller (client/controllers/partiesList.js):

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };

Now every time we will change the page, the scope variable will change accordingly and update the bind method that watches it.

* Notice that to buttons of the directive doesn't look very nice now because we haven't added any design and CSS to our application, we will do it later on.

# Getting total count of a collection

Getting a total count of a collection might seem easy, but there is a problem.
The client only holds the number of object that it subscribed to. that means that if the client is not subscribed to the whole array calling find().count on a collection will result in a partial count.

So we need access in the client for the total count even if we are not subscribed to the whole collection.

For that we can use the [tmeasday:publish-counts](https://github.com/percolatestudio/publish-counts) package. In the command line:

    meteor add tmeasday:publish-counts


That package helps to publish the count of a cursor, in real time without dependency on the subscribe method.

Inside the server/parties.js file, add the following code inside the Meteor.publish("parties" function, at the beginning of the function. before the existing return statement:

    Counts.publish(this, 'numberOfParties', Parties.find({
      $or:[
        {$and:[
          {"public": true},
          {"public": {$exists: true}}
        ]},
        {$and:[
          {owner: this.userId},
          {owner: {$exists: true}}
        ]}
    ]}), { noReady: true });

So the file should look like this now:

    Meteor.publish("parties", function (options) {
      Counts.publish(this, 'numberOfParties', Parties.find({
        $or:[
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]},
          {$and:[
            {owner: this.userId},
            {owner: {$exists: true}}
          ]}
      ]}), { noReady: true });
      return Parties.find({
        $or:[
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]},
          {$and:[
            {owner: this.userId},
            {owner: {$exists: true}}
        ]}
      ]} ,options);
    });

As you can see, we query only the parties that should be available to that specific client, but without the options variable so we get the full
number of parties.

* We are passing '{ noReady: true }' in the last argument so that the publication will be ready only after the our main cursor is ready - [readiness](https://github.com/percolatestudio/publish-counts#readiness).

Now on the client we have access to the Counts collection.
let's save that in the client/controllers/partiesList.js file when the subscription finishes successful (using the promise $meteor.subscribe returns):

    $meteor.subscribe('parties', {
      limit: parseInt($scope.perPage),
      skip: parseInt(($scope.page - 1) * $scope.perPage),
      sort: $scope.sort
    }).then(function(){
      $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
    });


Now the partiesCount will hold the number of parties and will send it to the directive in the parties-list.ng.html (which we already defined earlier).

But there is a problem - try to create a few parties and then change pages...  the subscription won't run again!

# Reactive variables

Meteor is relaying deeply on the concept of [reactivity](http://docs.meteor.com/#/full/reactivity).

This means that is a [reactive variable](http://docs.meteor.com/#/full/reactivevar) changes, Meteor is aware of that with it's [Tracker object](http://docs.meteor.com/#/full/tracker_autorun).

But Angular's scope variables are only watched by Angular and are not reactive vars for Meteor...

For that angular-meteor created [getReactively](http://angularjs.meteor.com/api/getReactively) - a way to make an Angular scope variable to a reactive variable.

So first, in order to make the subscription run each time something changes in one of the parameters, we need to place it inside an autorun block.
To do that, we are going to use the [$meteor.autorun](http://angularjs.meteor.com/api/utils) function:

    $meteor.autorun($scope, function() {

      $meteor.subscribe('parties', {
        limit: parseInt($scope.perPage),
        skip: parseInt(($scope.page - 1) * $scope.perPage),
        sort: $scope.sort
      }).then(function(){
        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
      });

    });

But this still won't help us because there is no reactive variables inside.  so let's use [getReactively](http://angularjs.meteor.com/api/getReactively) for that:

    $meteor.autorun($scope, function() {

      $meteor.subscribe('parties', {
        limit: parseInt($scope.getReactively('perPage')),
        skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort: $scope.getReactively('sort')
      }).then(function(){
        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
      });

    });

What's happening here is that getReactively returns a reactive variable that fires a changed event every time the scope variable changes,
and then autorun knows the execute it's given function again.
The will cause the subscription to re-run again with the new options parameter and we will get the correct data from the server.

$meteor.collection is also listening to reactive variables so let's change our $scope.parties initialization as well:

    $scope.parties = $meteor.collection(function() {
      return Parties.find({}, {
        sort : $scope.getReactively('sort')
      });
    });

Now run the app.
Create lots of parties and see that you can see only 3 at a time and you can scroll between the pages with the directive that populates the number of pages automatically.

# Changing the sort reactively

We haven't placed anywhere in the UI a way to change sorting so let's do that right now.

So in the HTML template, let's add a sorting dropdown inside the UL:

  </btf-markdown>

<pre><code>
  <span class="hljs-tag">&lt;<span class="hljs-title">h1</span>&gt;</span>Parties:<span class="hljs-tag">&lt;/<span class="hljs-title">h1</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">select</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"orderProperty"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"1"</span>&gt;</span>Ascending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"-1"</span>&gt;</span>Descending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">select</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
</code></pre>

      <btf-markdown>


in the controller lets associate that dropdown to $scope.sort:

    $scope.$watch('orderProperty', function(){
      if ($scope.orderProperty)
        $scope.sort = {name: parseInt($scope.orderProperty)};
    });

and also initialize it at the beginning:

    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

Now we don't have to do anything other than that. $scope.getReactively will take care of updating the subscription for us
when the sort changes. So all we have left is to sit back and enjoy out pagination working like a charm.

We made a lot of changes so please check the step's code [here](https://github.com/Urigo/meteor-angular-socially/compare/step_14...step_15)
to make sure you have everything needed and run the application.

# Reactive Search

Now that we have the basis for pagination, all we have left is to add reactive server-side searching of parties. That means
that we will be able to enter a search string and have the app search for parties that match that name in the server and
return only the relevant results! That is pretty awesome, and we are going to do all that only in several lines of code. So
let's get started.

As before, let's add the server side support. We need to add a new argument to our publish method which will hold the
requested search string. We will call it..... searchString! Here it goes:

    Meteor.publish("parties", function (options, searchString) {

Yep that was simple. Now we are going to filter the correct results using mongo's regex ability. We are going to add this
line at two places where we are using `find`, in publish Counts and in the return of the parties cursor:

    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },

So server/parties.js should look like that:

    Meteor.publish("parties", function (options, searchString) {
      if (searchString == null)
        searchString = '';
      Counts.publish(this, 'numberOfParties', Parties.find({
        'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
        $or:[
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]},
          {$and:[
            {owner: this.userId},
            {owner: {$exists: true}}
          ]}
      ]}), { noReady: true });
      return Parties.find({
        'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
        $or:[
          {$and:[
            {"public": true},
            {"public": {$exists: true}}
          ]},
          {$and:[
            {owner: this.userId},
            {owner: {$exists: true}}
          ]}
        ]} ,options);
    });

As you can see this will filter all the parties with a name that contains the searchString.

*  we added also if (searchString == null) searchString = '';  so that if we won't get that parameter we will just return the whole collection.

Now let's move on to the client side.

First let's place a search input into our template and bind it into a 'search' scope variable:

  </btf-markdown>

<pre><code>
  <span class="hljs-tag">&lt;<span class="hljs-title">h1</span>&gt;</span>Parties:<span class="hljs-tag">&lt;/<span class="hljs-title">h1</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">placeholder</span>=<span class="hljs-value">"Search"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">select</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"orderProperty"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"1"</span>&gt;</span>Ascending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"-1"</span>&gt;</span>Descending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">select</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
</code></pre>

      <btf-markdown>

And all we have left to do is call the subscribe method with our reactive scope variable:

    $meteor.subscribe('parties', {
      limit: parseInt($scope.getReactively('perPage')),
      skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
      sort: $scope.getReactively('sort')
    }, $scope.getReactively('search')).then(function() {

Wow that is all that is needed to have a fully reactive search with pagination! Quite amazing right?


# Stopping a subscription

There is only one problem in our app right now - if you will go into the party details page and then go back, the pagination and search will stop working.

The reason is that we are calling a different subscription on the same collection inside the partyDetails controller..

So to fix that, we will have to close that subscription after the partyDetails controller is destroyed.

Web can do that be calling $scope.subscribe method. it will automatically close the subscription when the scope gets destroyed.

First remove to subscription from $meteor.object:

    $scope.party = $meteor.object(Parties, $stateParams.partyId);

And now add the subscribe function:

    $scope.subscribe('parties');

That's it.


# Summary

Now we have full pagination with search and sorting for client and server side with the help of Meteor's options and Angular's directives.


  </btf-markdown>
    </do-nothing>
<div class="col-md-12">
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step12.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_11...step_12"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_13"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
    </div>
  </div>



