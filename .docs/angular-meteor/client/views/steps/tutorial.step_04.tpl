
  <div class="row">
    <div class="col-md-12">
        <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_04.tpl"
           class="btn btn-default btn-lg improve-button">
          <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
        </a>
        <ul class="btn-group tutorial-nav">
          <a href="/tutorial/step_03"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
          <a href="http://socially-step04.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
          <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_03...step_04"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
          <a href="/tutorial/step_05"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
        </ul>
  </div>

  <div class="col-md-8">
    <h1>Step 4 - Adding/removing objects and Angular event handling</h1>
  </div>
  <div class="video-tutorial col-md-4">
    <iframe width="300" height="169" src="//www.youtube.com/embed/aLkjOL0Yyo4?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
  </div>

  <do-nothing class="col-md-12">
  <btf-markdown>

Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter you will add the option to add a new party and delete an existing one.

First let's add a simple form with a button that will add a new party.

Add to following form inside the PartiesListCtrl div:

  </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">form</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">input</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">input</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">button</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>
</code></pre>

    <btf-markdown>

So that index.tpl will look like that:

__`index.tpl`:__

    </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-controller</span>=<span class="hljs-value">"PartiesListCtrl"</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">form</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">button</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties"</span>&gt;</span>
      </span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml">
      <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span>

<span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span></span>
</code></pre>

    <btf-markdown>


Now we need to make this form functional.

## ng-model

First thing, let's bind the value of the inputs into a new party variable.

To do that we will use the simple and powerful [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel) AngularJS directive.

Add ng-model to the form like this:

      </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">form</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.name"</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.description"</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">button</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>
</code></pre>

      <btf-markdown>

Now each time the user types inside those inputs, the value of the newParty scope variable will be automatically updated.  Conversely, if $scope.newParty is changed outside of the HTML, the input values will be updated accordingly.

## ng-click

Now let's bind a click event to the add button with Angular's [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick) directive.


    </btf-markdown>

<pre><code><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"parties.push(newParty); newParty='';"</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
</code></pre>

    <btf-markdown>

ng-click binds the click event into an expression.
So we take the parties scope array (when accessing scope variables in the HTML, there is no need to add $scope. before) and push the newParty variable into it.

Open a different browser, click the button and see how the party is added on both clients. So simple!


Now, let's add the ability to delete parties.

Let's add an X button to each party:

      </btf-markdown>

<pre><code><span class="xml">  <span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"party in parties"</span>&gt;</span>
      </span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml">
      <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

    <btf-markdown>


So this time we are binding ng-click to a scope function that gets the current party as a parameter.

So let's go into the controller and add that function.

Add that function inside the PartiesListCtrl in app.js:

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

And this is how the controller should look now:

    angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteorCollection',
      function($scope, $collection){

        $scope.parties = $meteorCollection(Parties);

        $scope.remove = function(party){
          $scope.parties.splice( $scope.parties.indexOf(party), 1 );
        };

    }]);


Now try to delete a few parties and also watch them being removed from other browser clients.


# AngularMeteorCollection functions

$meteorCollection's return value is a new collection from type AngularMeteorCollection.

It is not only responsible for keeping the collection updated, it also has helper functions for saving and deleting objects.

Let's try to use instead of the current solution.

First let's replace our push to save in the add button action:

        </btf-markdown>

    <pre><code><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"parties.save(newParty); newParty='';"</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    </code></pre>

    <btf-markdown>

There isn't a lot of difference here accept a little bit of performance, but now let's change our remove function:

    $scope.remove = function(party){
      $scope.parties.remove(party);
    };

Much nicer!  and also better performance.

Let's also add a button for remove all parties:

        </btf-markdown>

    <pre><code><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"removeAll()"</span>&gt;</span>remove all<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    </code></pre>

    <btf-markdown>

and add it's function in the scope:

    $scope.removeAll = function(){
      $scope.parties.remove();
    };

Very simple syntax.

You can read more about AngularMeteorCollection and it's helper functions in the [API reference](http://angularjs.meteor.com/api/AngularMeteorCollection).


# Summary

So now you've seen how easy it is to manipulate the data using AngularJS's powerful directives and sync that data with Meteor's powerful Mongo.collection API.


    </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_03"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step04.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_03...step_04"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_05"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>
