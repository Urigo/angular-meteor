
  <div>
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_12.tpl"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step12.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_11...step_12"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_13"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

    <do-nothing>
  <btf-markdown>

# Step 12 - Conditional template directives with AngularJS

AngularJS has great and very simple directives that help us show and hide DOM elements conditionally.
You can bind them to an expression, variables or functions.

# ng-show and ng-hide

First, let's learn about [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-hide](https://docs.angularjs.org/api/ng/directive/ngHide).

So one thing we want to hide and show is the form for creating a new party. If a user is not logged in, they can't create a party, so why displaying the form for them?
If the user is not logged in, we want to display a message saying they need to log in to create a new party.

In parties-list.tpl add a ng-show directive to the form like that:

    </btf-markdown>

<pre><code>&lt;<span class="hljs-tag">form</span> ng-show=<span class="hljs-string">"user"</span>&gt;
</code></pre>

      <btf-markdown>

Note that 'user' is the scope variable that we used earlier that is bound to the current logged-in user with the help of the `$user` service.
If it is undefined, this means that there is no logged-in user.  So only if 'user' exists will the form will be shown.

Then right after the form, add this HTML:

</btf-markdown>

<pre><code>
&lt;<span class="hljs-operator">div</span> ng-hide=<span class="hljs-string">"user"</span>&gt;
  Log <span class="hljs-operator">in</span> <span class="hljs-built_in">to</span> <span class="hljs-built_in">create</span> <span class="hljs-operator">a</span> party!
&lt;/<span class="hljs-operator">div</span>&gt;
</code></pre>

      <btf-markdown>

That is exactly the opposite - if 'user' exists, hide that div. Note that this statement is equivalent to ng-show="!user".

Now add the same to the RSVP buttons:

          </btf-markdown>

<pre><code>
&lt;div <span class="hljs-variable">ng-show=</span><span class="hljs-string">"user"</span>&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"I'm going!"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'yes')"</span>&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"Maybe"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'maybe')"</span>&gt;
  &lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"button"</span> <span class="hljs-variable">value=</span><span class="hljs-string">"No"</span> <span class="hljs-variable">ng-click=</span><span class="hljs-string">"rsvp(party._id, 'no')"</span>&gt;
&lt;/div&gt;
</code></pre>

      <btf-markdown>


Next thing we want to hide is the 'delete party' option, in case the logged-in user is not the party's owner.
Lets add ng-show to the delete button like that:

</btf-markdown>

<pre><code><span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"user &amp;&amp; user._id == party.owner"</span>&gt;</span>X<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
</code></pre>

      <btf-markdown>

In here you can see that `ng-show` can get a statement, in our case - the user exists (logged in) and is also the party's owner.


# ng-if

[ng-if](https://docs.angularjs.org/api/ng/directive/ngIf) acts almost the same as `ng-show` but the difference between them
is that `ng-show` hides the element by changing the display css property and `ng-if` simply removes it from the DOM completely.

So let's use `ng-if` to hide the outstanding invitations from a party, if the party is public (everyone is invited!):

</btf-markdown>

        <pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"!party.public"</span>&gt;</span>
  Users who not responded:
  <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"invitedUser in outstandingInvitations(party)"</span>&gt;</span>
    </span><span class="hljs-expression">{{ <span class="hljs-variable">invitedUser</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml">
  <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"party.public"</span>&gt;</span>
  Everyone is invited
<span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span></span>
        </code></pre>

      <btf-markdown>

# Assigning a function

Now lets hide the 'Users to invite' inside party-details.tpl is case the user is not logged in or can't invite to the party:

To do that we will create a scope function that returns a boolean and associate it with `ng-show`:

Create a new function inside partyDetailsCtrl inside the partyDetails.js file named `canInvite`:

    $scope.canInvite = function (){
      if (!$scope.party)
        return false;

      return !$scope.party.public &&
        $scope.party.owner === Meteor.userId();
    };

and add the `ng-show` to the `ul` in party-details.tpl:

</btf-markdown>

<pre><code><span class="xml">  <span class="hljs-tag">&lt;<span class="hljs-title">ul</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"canInvite()"</span>&gt;</span>
    Users to invite:
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"invite(user)"</span>&gt;</span>Invite<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
</code></pre>

      <btf-markdown>

Now lets add a `div` that tells the user that everyone is already invited, if that is the case:

</btf-markdown>

      <pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">ul</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"canInvite()"</span>&gt;</span>
    Users to invite:
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"invite(user)"</span>&gt;</span>Invite<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">li</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"(users | uninvited:party).length &lt;= 0"</span>&gt;</span>
      Everyone are already invited.
    <span class="hljs-tag">&lt;/<span class="hljs-title">li</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">ul</span>&gt;</span></span>
      </code></pre>

      <btf-markdown>
Here, we are taking the result of the uninvited users and checking for its length.

# ng-disabled

Now lets disable the partyDetails input fields in case the user doesn't have permission to change them (currently, the server is stopping the user, but there is no visual feedback aside from the server overriding the local edit immediately after):

     </btf-markdown>

<pre><code>
&lt;input <span class="hljs-variable">ng-model=</span><span class="hljs-string">"party.name"</span> <span class="hljs-variable">ng-disabled=</span><span class="hljs-string">"party.owner != $root.currentUser._id"</span>&gt;
  &lt;input <span class="hljs-variable">ng-model=</span><span class="hljs-string">"party.description"</span> <span class="hljs-variable">ng-disabled=</span><span class="hljs-string">"party.owner != $root.currentUser._id"</span>&gt;
  &lt;label&gt;Is public&lt;/label&gt;
&lt;input <span class="hljs-variable">type=</span><span class="hljs-string">"checkbox"</span> <span class="hljs-variable">ng-model=</span><span class="hljs-string">"party.public"</span> <span class="hljs-variable">ng-disabled=</span><span class="hljs-string">"party.owner != $root.currentUser._id"</span>&gt;
</code></pre>

      <btf-markdown>


# Summary

So now our example looks much better after we hide things based on the current situation.

In the next chapter we will add some CSS and styling to our app.

      </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial-02/step_11"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step12.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_11...step_12"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial-02/step_13"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>



