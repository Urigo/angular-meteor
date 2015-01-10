
  <div>
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_11.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_10"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step11.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_10...step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_12"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

    <do-nothing>
  <btf-markdown>

# Step 11 - Meteor methods with promises

In this step we will learn how to use Meteor methods and how angular-meteor enhances them with the support of promises.

Meteor methods are a way to perform more complex logic then the allow method does.
The Meteor methods are responsibly for checking permissions, just like the allow method does.

In our case, we will create an invite method that invites a user to a party.

Paste the following code into the end of parties.js file in the model directory:


      Meteor.methods({
        invite: function (partyId, userId) {
          check(partyId, String);
          check(userId, String);
          var party = Parties.findOne(partyId);
            if (!party)
              throw new Meteor.Error(404, "No such party");
            if (party.owner !== this.userId)
              throw new Meteor.Error(404, "No such party");
            if (party.public)
              throw new Meteor.Error(400,
                "That party is public. No need to invite people.");

          if (userId !== party.owner && ! _.contains(party.invited, userId)) {
            Parties.update(partyId, { $addToSet: { invited: userId } });

            var from = contactEmail(Meteor.users.findOne(this.userId));
            var to = contactEmail(Meteor.users.findOne(userId));

            if (Meteor.isServer && to) {
              // This code only runs on the server. If you didn't want clients
              // to be able to see it, you could move it to a separate file.
              Email.send({
                from: "noreply@socially.com",
                to: to,
                replyTo: from || undefined,
                subject: "PARTY: " + party.title,
                text:
                  "Hey, I just invited you to '" + party.title + "' on Socially." +
                  "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
              });
            }
          }
        }
      });

      var contactEmail = function (user) {
        if (user.emails && user.emails.length)
          return user.emails[0].address;
        if (user.services && user.services.facebook && user.services.facebook.email)
          return user.services.facebook.email;
        return null;
      };

Let's look at the code.

First, all Meteor methods are defined inside Meteor.methods({}); object.

Each property of that object is a method and the name of that property in the name of the method. in our case - invite.

Then the value of the property is the function we call. in our case it takes 2 parameters - the party id and the invited user id.

First, we check validation with the the [check](http://docs.meteor.com/#check_package) function.

the rest of the code is pretty much self explanatory, but important thing to notice is the Email function that sends email to the invited client.
This function can't be called from the client side so we have to put it inside an isServer statement.

Don't forget to add the email package to your project in the command line:

    meteor add email



Now let's call that method from the client.

Inside the partyDetails controller add '$meteorMethods' to the controller's dependencies:

    angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$collection', '$meteorMethods',
      function($scope, $stateParams, $collection, $meteorMethods){


Then add a scope method called invite:

    $scope.invite = function(user){
      $meteorMethods.call('invite', $scope.party._id, user._id).then(
        function(data){
          console.log('success inviting', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };

* Parameter 1 - Meteor method name
* Parameter 2 and 3 - The Meteor method's arguments
* Return value - A promise

The promise we resolve with 'then' which defines 2 parameters:

* Parameter 1 - A function that handles success
* Parameter 2 - A function that handles failure

Now let's add a button to invite each user we want. Edit the users lists in the partyDetails template to look like this:

    </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
  Users:
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"invite(user)"</span>&gt;</span>Invite<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

      <btf-markdown>

Now that we have the invite function working, we also want to publish the parties to the invited users.
Let's add that permission to the publish parties method:

      {$and:[
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}

And the full publish method:

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
          ]},
          {$and:[
            {invited: this.userId},
            {invited: {$exists: true}}
          ]}
        ]});
    });

Great!

Now test the app.  create a private party with user1.  then invite user2. log in as user2 and see if he can see the party in his own parties list.


Now let's add the RSVP functionality so invited users can respond to invitations.

First let's add a Meteor.method to parties.js in the model folder (remember to place it as a property inside the Meteor.methods object):

     rsvp: function (partyId, rsvp) {
       check(partyId, String);
       check(rsvp, String);
       if (! this.userId)
         throw new Meteor.Error(403, "You must be logged in to RSVP");
       if (! _.contains(['yes', 'no', 'maybe'], rsvp))
         throw new Meteor.Error(400, "Invalid RSVP");
       var party = Parties.findOne(partyId);
       if (! party)
         throw new Meteor.Error(404, "No such party");
       if (! party.public && party.owner !== this.userId &&
           !_.contains(party.invited, this.userId))
         // private, but let's not tell this to the user
         throw new Meteor.Error(403, "No such party");

       var rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);
       if (rsvpIndex !== -1) {
       // update existing rsvp entry

         if (Meteor.isServer) {
           // update the appropriate rsvp entry with $
           Parties.update(
             {_id: partyId, "rsvps.user": this.userId},
             {$set: {"rsvps.$.rsvp": rsvp}});
         } else {
           // minimongo doesn't yet support $ in modifier. as a temporary
           // workaround, make a modifier that uses an index. this is
           // safe on the client since there's only one thread.
           var modifier = {$set: {}};
           modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
           Parties.update(partyId, modifier);
         }
       // Possible improvement: send email to the other people that are
       // coming to the party.
       } else {
         // add new rsvp entry
         Parties.update(partyId,
           {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
       }
     }

The function gets the party's id and the response ('yes', 'maybe' or 'no').

Like the invite method, first we check for all kinds of validations, then we do the wanted logic.

Now let's call that function from the partiesList.
Add an rsvp scope function to the partiesListCtrl in partiesList.js:

    $scope.rsvp = function(partyId, rsvp){
      $meteorMethods.call('rsvp', partyId, rsvp).then(
        function(data){
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };

don't forget to add the $meteorMethods service to the controllers dependencies:

      angular.module("socially").controller("PartiesListCtrl", ['$scope', '$collection', '$user', '$meteorMethods',
        function($scope, $collection, $user, $meteorMethods){


and let's add action buttons to call the right rsvp in the HTML.
Add this code into parties-list.tpl inside the parties list itself (inside the ng-repeat):

        </btf-markdown>
<pre><code>  &lt;div&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"I'm going!"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'yes')"</span>&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"Maybe"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'maybe')"</span>&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"No"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'no')"</span>&gt;
  &lt;/div&gt;
</code></pre>

      <btf-markdown>


Now let's display for each party who is coming.
Just after the code you just added (still inside the parties ng-repeat) add the following code:

   </btf-markdown>

<pre><code><span class="xml">  <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
    Who is coming:
    Yes - </span><span class="hljs-expression">{{ (<span class="hljs-variable">party.rsvps</span> | <span class="hljs-variable">filter</span>:{<span class="hljs-variable">rsvp</span>:'<span class="hljs-variable">yes</span>'})<span class="hljs-variable">.length</span> }}</span><span class="xml">
    Maybe - </span><span class="hljs-expression">{{ (<span class="hljs-variable">party.rsvps</span> | <span class="hljs-variable">filter</span>:{<span class="hljs-variable">rsvp</span>:'<span class="hljs-variable">maybe</span>'})<span class="hljs-variable">.length</span> }}</span><span class="xml">
    No - </span><span class="hljs-expression">{{ (<span class="hljs-variable">party.rsvps</span> | <span class="hljs-variable">filter</span>:{<span class="hljs-variable">rsvp</span>:'<span class="hljs-variable">no</span>'})<span class="hljs-variable">.length</span> }}</span><span class="xml">
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"rsvp in party.rsvps | filter:{rsvp:'yes'}"</span>&gt;</span>
      </span><span class="hljs-expression">{{ <span class="hljs-variable">getUserById</span>(<span class="hljs-variable">rsvp.user</span>) | <span class="hljs-variable">displayName</span> }}</span><span class="xml"> - </span><span class="hljs-expression">{{ <span class="hljs-variable">rsvp.rsvp</span> }}</span><span class="xml">
    <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"rsvp in party.rsvps | filter:{rsvp:'maybe'}"</span>&gt;</span>
      </span><span class="hljs-expression">{{ <span class="hljs-variable">getUserById</span>(<span class="hljs-variable">rsvp.user</span>) | <span class="hljs-variable">displayName</span> }}</span><span class="xml"> - </span><span class="hljs-expression">{{ <span class="hljs-variable">rsvp.rsvp</span> }}</span><span class="xml">
    <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"rsvp in party.rsvps | filter:{rsvp:'no'}"</span>&gt;</span>
      </span><span class="hljs-expression">{{ <span class="hljs-variable">getUserById</span>(<span class="hljs-variable">rsvp.user</span>) | <span class="hljs-variable">displayName</span> }}</span><span class="xml"> - </span><span class="hljs-expression">{{ <span class="hljs-variable">rsvp.rsvp</span> }}</span><span class="xml">
    <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span></span>
</code></pre>
      <btf-markdown>

First, take a look at the use of filter with length to find how many people responded with each response type.

then, look at using ng-repeat inside an ng-repeat - ng-repeat on revps inside party from the parties ng-repeat.

Now let's add a list of the users who haven't responded yet just below the code we just added:

        </btf-markdown>

<pre><code><span class="xml">  <span class="hljs-tag">&lt;<span class="hljs-title">ul</span>&gt;</span>
    Users who not responded:
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"invitedUser in outstandingInvitations(party)"</span>&gt;</span>
      </span><span class="hljs-expression">{{ <span class="hljs-variable">invitedUser</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml">
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

      <btf-markdown>

Again, an ng-repeat inside an ng-repeat.  this time we are calling a function the will give us back all the users who haven't responded to that specific party.
add that function inside the partiesListCtrl in the partiesList.js file:

    $scope.outstandingInvitations = function (party) {

      return _.filter($scope.users, function (user) {
        return (_.contains(party.invited, user._id) &&
          !_.findWhere(party.rsvps, {user: user._id}));
      });
    };

here we are using underscore's _.filter, _.contains and _.findWhere to extract the users who are invited to the party but are not exist in the rsvps array.

Notice we are doing this check on $scope.users but we haven't initialized it yet in this controller. so add this code as well:

    $collection(Meteor.users).bind($scope, 'users', false, true);



# Summery

Run the application.

Looks like we have all the functionality we need but there is a lot of mess in the display.
There are stuff that there is no need for them to show up if the user is not authorized to see or if they are empty.

So in the next chapter we are going to learn about a few simple but very useful AngularJS directive to help us conditionally add or remove DOM.

    </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_10"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step11.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_10...step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_12"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>



