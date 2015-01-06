
<div class="row">
  <div class="col-md-12">
        <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_06.html"
           class="btn btn-default btn-lg improve-button">
          <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
        </a>
      <ul class="btn-group tutorial-nav">
        <a href="/tutorial/step_05"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
        <a href="http://socially-step06.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
        <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_05...step_06"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
        <a href="/tutorial/step_07"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
      </ul>
    </div>

  <div class="col-md-8">
    <h1>Step 6 - Bind one object</h1>
  </div>
  <div class="video-tutorial col-md-4">
    <iframe width="300" height="169" src="//www.youtube.com/embed/XxkayFJ8r4A?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
  </div>

  <do-nothing class="col-md-12">
  <btf-markdown>

In this step, you will implement the party details view, which is displayed when a user clicks on a party in the parties list.
The user will also be able to change the party's details.

To implement the party details view we will use $meteorCollection to fetch our data, and update it back in realtime when the user changes it.

# Controller

We'll expand the PartyDetailsCtrl by using the $meteorCollection service (add it with Angular's dependency injection) to bind the specific party.

    angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteorCollection',
      function($scope, $stateParams, $meteorCollection){

        $scope.party = $meteorCollection(function() {
          return Parties.find({
            _id : $stateParams.partyId
          });
        })[0];

    }]);

To bind to a specific object, we call the $meteorCollection function with the first parameter as a [reactive function](http://docs.meteor.com/#/full/find)
and then we take the first instance of the array with [0]  .


# Template

In party-details.tpl let's replace the binding to the partyId with binding to party.name and party.description:

__`party-details.tpl`:__

  </btf-markdown>

<pre><code>  Here you will see and change the <span class="hljs-tag">details</span> of the party:

  &lt;<span class="hljs-tag">input</span> ng-model=<span class="hljs-string">"party.name"</span>&gt;
  &lt;<span class="hljs-tag">input</span> ng-model=<span class="hljs-string">"party.description"</span>&gt;
</code></pre>


    <btf-markdown>

Now, when you run the app, navigate into a party's page, and change the inputs, the server and all the clients update immediately.
No save buttons, no round trips, it just works.

# Classic Save and Cancel buttons

In case you don't want to use the live editing that angular-meteor provides and want to preset to your users a classic "Save" "Cancel" form, you can do that as well.

First, let's a second parameter to $meteorCollection with value false (cancel the auto-bind).
Then, let's add a bind to the whole collection with regular bind.
Now, it means that we have access to the save function of the collection from the bind function and we can use it in a click of a button:


    $collection(Parties).bindOne($scope, 'party', $stateParams.partyId, false);
    $collection(Parties).bind($scope, 'parties');

    $scope.saveParty = function(){
      $scope.parties.save($scope.party);
    };

And then in the template (with a cancel button that simply directs back to the parties list without doing any save functionality):

    <template name="party-details.html">
      Here you will see and change the details of the party:

      <input ng-model="party.name">
      <input ng-model="party.description">

      <button ng-click="saveParty()">Save</button>

      <button><a href="/parties">Cancel</a></button>

    {{lt}}/template>


# Summary

We've seen the power of 3-way binding between the DOM, AngularJS and Meteor.

Let's move on to provide some order and structure in our application.

      </btf-markdown>
</do-nothing>

  <ul class="btn-group tutorial-nav">
    <a href="/tutorial/step_05"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
    <a href="http://socially-step06.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
    <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_05...step_06"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
    <a href="/tutorial/step_07"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
  </ul>
</div>

