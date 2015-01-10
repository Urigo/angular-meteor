
  <div class="row">
    <div class="col-md-12">
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_09.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_08"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step09.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_08...step_09"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_10"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

  </div>

  <div class="col-md-8">
    <h1>Step 9 - Privacy and publish-subscribe functions</h1>
  </div>
  <div class="video-tutorial col-md-4">
    <iframe width="300" height="169" src="//www.youtube.com/embed/aovtn-JFy_Y?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
  </div>

  <do-nothing class="col-md-12">
  <btf-markdown>

Right now our app has no privacy, every user can see all the parties on the screen.

So let's add a 'public' flag on parties - if a party is public we will let anyone see it, but if a party if private, only the owner can see it.

First we need to remove the 'autopublish' Meteor package.

autopublish is added to any new Meteor project. It pushes a full copy of the database to each client.
It helped us until now, but it's not so good for privacy...

Write this command in the consle:

    meteor remove autopublish


Now run the app.   You can't see any parties.

So now we need to tell Meteor what parties should it publish to the clients.

To do that we will use Meteor's publish command.

Publish functions should go only in the server so the client won't have access to them.
So let's create a new file named parties.js inside the server folder.

Inside the file insert this code:

    Meteor.publish("parties", function () {
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
        ]});
    });

Let's see what is happening here.

First, we have the Meteor.publish - a function to define what to publish from the server to the client.

The first parameter is the name of the subscription. the client will subscribe to that name.

The second parameter is a function the defines what will be returned in the subscription.
That function will determine what data will be returned and the permissions needed.

In our case the first name parameter is "parties". So we will need to subscribe to the "parties" collection in the client.

We have 2 way of doing this:

1. Using the [$meteorSubscribe](/api/subscribe) service that also return a promise when the subscribing is done
2. using [AngularMeteorCollection's](/api/AngularMeteorCollection) subscribe function which is exactly the same but it's
here just for syntactic sugar doesn't return a promise.

Right now we don't need the promise so let's use the second way:

    $scope.parties = $meteorCollection(Parties).subscribe('parties');


* Our publish function can also take parameters.  In that case, we would also need to pass the parameters from the client.
For more information about the $meteorSubscribe service [click here](http://angularjs.meteor.com/api/subscribe) or the subscribe function of [AngularMeteorCollection](/api/AngularMeteorCollection).


In the second parameter, our function uses the Mongo API to return the wanted documents (document are the JSON-style data structure of MongoDB).

So we create a query - start with the find method on the Parties collection.

Inside the find method we use the [$or](http://docs.mongodb.org/manual/reference/operator/query/or/), [$and](http://docs.mongodb.org/manual/reference/operator/query/and/) and [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/) Mongo operators to pull our wanted parties:

Either that the owner parameter exists and it's the current logged in user (which we have access to with the command this.userId), or that the party's public flag exists and it's set as true.


So now let's add the public flag to the parties and see how it affects the parties the client gets.

Let's add a checkbox to the new party form in parties-list.tpl:

  </btf-markdown>

<pre><code><span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Public<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"checkbox"</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.public"</span>&gt;</span>
</code></pre>

    <btf-markdown>

Notice how easy it is to bind a checkbox to a model with AngularJS!

Let's add the same to the party-details.tpl page:

        </btf-markdown>

<pre><code>&lt;<span class="hljs-keyword">label</span>&gt;<span class="hljs-keyword">Is</span> public&lt;/<span class="hljs-keyword">label</span>&gt;
&lt;input <span class="hljs-keyword">type</span>=<span class="hljs-string">"checkbox"</span> ng-model=<span class="hljs-string">"party.public"</span>&gt;
</code></pre>

        <btf-markdown>

Now let's run the app.

Log in with 2 different users in 2 different browsers.

In each of the users create a few public parties and a few private ones.

Now log out and see which user sees which parties.


In the next step, we will want to invite users to private parties. for that, we will need to get all the users, but only their emails without other data which will hurt their privacy.

So let's create another publish method for getting only the needed data on the user.

Notice the we don't need to create a new Meteor collection like we did with parties. **Meteor.users** is a pre-defined collection which is defined by the [meteor-accounts](http://docs.meteor.com/#accounts_api) package.

So let's start with defining our publish function.

Create a new file under the 'server' folder named users.js and place the following code in:

    Meteor.publish("users", function () {
      return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    });

So here again we use the Mongo API to return all the users (find with an empty object) but we select to return only the emails and profile fields.

* Notice that each object (i.e. each user) will automatically contain its _id field.

The emails field holds all the user's email addresses, and the profile might hold more optional information like the user's name 
(in our case, if the user logged in with the Facebook login, the accounts-facebook package puts the user's name from Facebook automatically into that field).

Now let's subscribe to that publish Method.  in the client->parties->controllers->partyDetails.js file add the following line:

    $scope.users = $meteorCollection(Meteor.users, false).subscribe('users');

* We bind to the Meteor.users collection
* Binding the result to $scope.users
* Notice that we passes false in the second parameter. that means that we don't want to update that collection from the client.
* Calling [AngularMeteorCollection's](/api/AngularMeteorCollection) subscribe function.

Also, let's add a subscription to the party in case we get strait to there and won't go through the parties controller:

    $scope.party = $meteorObject(Parties, $stateParams.partyId).subscribe('parties');


Now let's add the list of users to the view to make sure it works.

Add this ng-repeat list to the end of parties-details.tpl:

</btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Users:
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user.emails</span>[0]<span class="hljs-variable">.address</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

<btf-markdown>

Run the app and see the list of all the users' emails.


# Understanding Meteor's Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscription of a collection in the client, so adding a different subscription in a different
view won't delete the data that is already in the client.

Please read more [here](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

We've added the support of privacy to our parties app.

We also learned how to use the Meteor.publish command to control the data and permissions sent to the client
and how to subscribe to it with the $collection.bind 4th parameter.

In the next step we will learn how to filter the users list in the client side with AngularJS filters and create a custom filter for our own needs.

    </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_08"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step09.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_08...step_09"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_10"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>

