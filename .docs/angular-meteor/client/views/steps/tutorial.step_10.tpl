
    <div class="row">
      <div class="col-md-12">
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_10.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_09"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step10.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_09...step_10"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_11"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

  </div>

  <div class="col-md-8">
    <h1>Step 10 - Using and creating AngularJS filters</h1>
  </div>
  <div class="video-tutorial col-md-4">
    <iframe width="300" height="169" src="//www.youtube.com/embed/FusQ1D8jy3o?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
  </div>

  <do-nothing class="col-md-12">
    <btf-markdown>

Our next mission is to invite users to private parties.

We have subscribed to list of all users, but we can't invite everyone.
We can't invite the owner of the party and we can't invite users who are already invited, so why not filter them out of the view?

To do so we will use the powerful [filter feature](https://docs.angularjs.org/guide/filter) of AngularJS.

But before we create our own, let's learn how to use some of the [built-in filters](https://docs.angularjs.org/api/ng/filter) in the core AngularJS module.

Let's add a search feature to our app.

Add a search input into the parties-list.tpl file:

        </btf-markdown>

<pre><code>&lt;input <span class="hljs-class"><span class="hljs-keyword">type</span></span>=<span class="hljs-string">"search"</span> ng-model=<span class="hljs-string">"search"</span>&gt;
</code></pre>

    <btf-markdown>

and then we will filter the parties array with that. The parties list HTML should look like that:

        </btf-markdown>
<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Parties:
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
    Search
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"search"</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties | filter:search "</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties/</span></span></span><span class="hljs-expression">{{<span class="hljs-variable">party.</span>_<span class="hljs-variable">id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-value">"</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>

    <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

    <btf-markdown>

That's it!   Try to run the app and write a search query in the input field.

So what we did here is process the parties array with a filter with the parameter "search".

Now let's use another filter to order the parties list.

Let's add a select tag that is bound to a scope property that will control the sort direction of the party list:

        </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">select</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"orderProperty"</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"name"</span>&gt;</span>Ascending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"-name"</span>&gt;</span>Descending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">select</span>&gt;</span>
</code></pre>

    <btf-markdown>

And let's add the orderBy filter with the orderProperty parameter:

</btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Parties:
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
    Search
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"search"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">select</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"orderProperty"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"name"</span>&gt;</span>Ascending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"-name"</span>&gt;</span>Descending<span class="hljs-tag">&lt;/<span class="hljs-title">option</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">select</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties | filter:search | orderBy:orderProperty "</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties/</span></span></span><span class="hljs-expression">{{<span class="hljs-variable">party.</span>_<span class="hljs-variable">id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-value">"</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>

    <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

      <btf-markdown>

Add the following line to the partiesListCtrl controller in parties-list.js to initialize the sorting we want to start with:

    $scope.orderProperty = 'name';


Filters can work on array as well as single values.
We can aggregate any number of filters on top of each other.

Here is the list of all of AngularJS built-in filters:
[https://docs.angularjs.org/api/ng/filter](https://docs.angularjs.org/api/ng/filter)

And here is a 3rd party library with many more filters:
[angular-filter](https://github.com/a8m/angular-filter)


Now that we know how to use filters,
let's create a custom filter that will filter out users that are the owners of a certain party and that are already invited to it.

Create a new folder named 'filters' under the client->parties folder.

Under that folder create a new file named uninvited.js and place that code inside:

    angular.module("socially").filter('uninvited', function () {
      return function (users, party) {
        if (!party)
          return false;

        return _.filter(users, function (user) {
          if (user._id == party.owner ||
              _.contains(party.invited, user._id))
            return false;
          else
            return true;
        });
      }
    });

* So first we define a filter to the "socially" module (our app).
* The filter named 'uninvited'
* Filters always get at least one parameter and the first parameter is always the object or array that we are filtering (like the parties in the previous example.
So here we are filtering the users array so that's the first parameter
* The second parameter is the party we want to check
* The first if statement is to make sure we passed the initializing phase of the party and it's not undefined

At this point we need to return the filtered array.

The great thing here is that thanks to Meteor we have access to the great [underscore](http://docs.meteor.com/#underscore) library.

So we use underscore's "filter" method to remove each user that either isn't the party's owner or that
is not already _contains (another underscore method) in the invited list.

So now let's use our new filter

Simply add the filter to the list of users and send the current party to the party parameter, inside party-details.tpl:

          </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Users to invite:
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user.emails</span>[0]<span class="hljs-variable">.address</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

    <btf-markdown>

Run the app and see the users in each party.

We still don't have invites but you can see that the filter already filters the party owners out of the list.

But some of the users don't have emails (maybe some of them may have signed in with Facebook). In that case we want to display their name and not the empty email field.

But it's only in the display so its perfect for a filter.

We want the list to simply look like this:

        </btf-markdown>
<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Users to invite:
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

    <btf-markdown>

and that the filter displayName will handle to logic and display the user's name in the best way possible.

So let's create another custom filter 'displayName'.

Create a new file under the filters folder named displayName.js and place that code inside:

    angular.module("socially").filter('displayName', function () {
      return function (user) {
        if (!user)
          return;
        if (user.profile && user.profile.name)
          return user.profile.name;
        else if (user.emails)
          return user.emails[0].address;
        else
          return user;
      }
    });


Pretty simple logic but it's so much nicer to put it here and make the HTML shorter and more readable.

AngularJS can also display the return value of a function in the HTML.

To demonstrate let's add to each party in the parties list the creator's name:

Add this line to the parties list in parties-list.tpl:

        </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">small</span>&gt;</span>Posted by </span><span class="hljs-expression">{{ <span class="hljs-variable">creator</span>(<span class="hljs-variable">party</span>) }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">small</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>

    <btf-markdown>

so it will look like this:

        </btf-markdown>
<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties | filter:search | orderBy:orderProperty "</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties/</span></span></span><span class="hljs-expression">{{<span class="hljs-variable">party.</span>_<span class="hljs-variable">id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-value">"</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">small</span>&gt;</span>Posted by </span><span class="hljs-expression">{{ <span class="hljs-variable">creator</span>(<span class="hljs-variable">party</span>) }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">small</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span></span>
</code></pre>

    <btf-markdown>

and define the creator scope function in the partiesListCtrl in partiesList.js:

    $scope.getUserById = function(userId){
      return Meteor.users.findOne(userId);
    };

    $scope.creator = function(party){
      if (!party)
        return;
      var owner = $scope.getUserById(party.owner);
      if (!owner)
        return "nobody";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";

      return owner;
    };

* Remember to add $rootScope to the controller's dependency injection

As you can see, we are using the Meteor.users collection here but we haven't made sure that we are subscribing to it
(If we visited the partyDetails controller before getting here, partyDetails controller would subscribe to the Meteor.users collection,
but if we weren't, we would get an empty array in Meteor.users).
So let's add a subscription to Meteor.users in the list controller as well:

        $meteorSubscribe.subscribe('users');

* Don't forget to add dependency to the [$meteorSubscribe service](http://angularjs.meteor.com/api/subscribe) in our controller


Now we get the user object to the HTML. But we want his name, so let's put the displayName filter on that as well:

        </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">small</span>&gt;</span>Posted by </span><span class="hljs-expression">{{ <span class="hljs-variable">creator</span>(<span class="hljs-variable">party</span>) | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">small</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>

    <btf-markdown>



# Summary

In this chapter we learned about AngularJS filters and how easy they are to use and to read from the HTML.

In the next step we will learn about Meteor methods, which enables us to run custom logic in the server, beyond the Mongo API and the allow/deny methods.



      </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_09"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step10.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_09...step_10"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_11"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>



