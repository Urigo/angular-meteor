
  <div>
    <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_18.html"
       class="btn btn-default btn-lg improve-button">
      <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
    </a>
    <ul class="btn-group tutorial-nav">
      <a href="/tutorial/step_17"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step18.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_17...step_18"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_19"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>

    <div class="col-md-8">
      <h1>Step 18 - angular-material</h1>
    </div>
    <div class="video-tutorial col-md-4">
      <iframe width="300" height="169" src="//www.youtube.com/embed/A6qsm_RDc9Y?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
    </div>

    <do-nothing class="col-md-12">
      <btf-markdown>

In this step we will consider switching from *Twitter Bootstrap* to [*angular-material*](https://material.angularjs.org/#/). 

Angular-material is an AngularJS wrapper for Google's Material Design CSS framework. Material Design is a mobile-first design language used in many new Google's applications, especially on the Android platform. 

First we have to remove bootstrap from our application. Type in the console:

    meteor remove twbs:bootstrap

Now we have to add the angular-material Meteor package:

    meteor add angular:angular-material

Next, we want to inject the angular-material module to our Angular application. Edit your `client/lib/app.js` and add `ngMaterial`:

        angular.module('socially',[
	      'angular-meteor',
	      'ui.router',
	      'angularUtils.directives.dirPagination',
	      'uiGmapgoogle-maps', 
	      'ngMaterial'
	    ]);

That's it, now we can use angular-material in our application layout. 

Angular-material uses declarative syntax, i.e. directives, to utilize Material Design elements in HTML documents. 

First we want to change our `index.html` to make use of the flex grid layout provided by Material Design. So, change your `client/index.html` to look like this:

      </btf-markdown>

<pre><code>
  <span class="hljs-tag">&lt;<span class="hljs-title">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">meta</span> <span class="hljs-attribute">name</span>=<span class="hljs-value">"viewport"</span> <span class="hljs-attribute">content</span>=<span class="hljs-value">"width=device-width, initial-scale=1"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">base</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/"</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">head</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">body</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-toolbar</span> <span class="hljs-attribute">md-scroll-shrink</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"row"</span> <span class="hljs-attribute">layout-align</span>=<span class="hljs-value">"start center"</span> <span class="hljs-attribute">layout-padding</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties"</span>&gt;</span>Parties<span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">span</span> <span class="hljs-attribute">flex</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">span</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"navbar-right navbar-text"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">meteor-include</span> <span class="hljs-attribute">src</span>=<span class="hljs-value">"loginButtons"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">meteor-include</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">md-toolbar</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ui-view</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"container-fluid"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">body</span>&gt;</span>
</code></pre>

	    <btf-markdown>

You can see we use `layout="column"` in the `body` tag, which tells angular-material to lay all inner tags of `body` vertically.

Next, we use the handy `md-toolbar` directive as a wrapper for our app's toolbar.
We tell it to shrink on vertical scroll with `md-scroll-shrink` attribute and to lay inner elements in a row.

We also tell it `layout-align="start center"` to lay inner elements at `start` of the primary direction (row), meaning element should start at the left edge, and lay them at `center` of the secondary direction (column), so they are stacked centrally in the vertical direction.
We also tell it to put padding around all inner elements with `layout-padding`.

Inside the `md-toolbar` you see we used
</btf-markdown><pre><code>&lt;<span class="hljs-tag">span</span> <span class="hljs-attribute">flex</span>&gt;&lt;/span&gt;
    </code></pre><btf-markdown>
element which is actually a separator blank element which is used to fill all the available blank space between the first and third element in the toolbar.

So, now we have a link to Parties to the left, a span to fill all space, and a login button.
Element layout flex grid is very simple and intuitive in angular-material and you can read all about it [here](https://material.angularjs.org/#/layout/grid).

Next, we need to convert our parties list and party detail views to angular-material. 
First, replace the code in your `client/views/parties-list.ng.html` with this code:

	    </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">md-content</span> <span class="hljs-attribute">layout-padding</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">md-whiteframe</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"md-whiteframe-z1"</span> <span class="hljs-attribute">layout</span> <span class="hljs-attribute">layout-align</span>=<span class="hljs-value">"center center"</span> <span class="hljs-attribute">ng-hide</span>=<span class="hljs-value">"$root.currentUser || $root.loggingIn"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">span</span>&gt;</span>Log in to create a party!<span class="hljs-tag">&lt;/<span class="hljs-title">span</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">md-whiteframe</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">form</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"$root.currentUser"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">h2</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"md-headline"</span>&gt;</span>Create a new party:<span class="hljs-tag">&lt;/<span class="hljs-title">h2</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.name"</span> <span class="hljs-attribute">id</span>=<span class="hljs-value">"nameInput"</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Name"</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.description"</span> <span class="hljs-attribute">id</span>=<span class="hljs-value">"description"</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Description"</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-checkbox</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"newParty.public"</span> <span class="hljs-attribute">id</span>=<span class="hljs-value">"public"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Public"</span>&gt;</span>
          Public
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-checkbox</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"newParty.owner=$root.currentUser._id;parties.push(newParty); newParty='';"</span>&gt;</span>Add<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">h2</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"md-headline"</span>&gt;</span>Parties:<span class="hljs-tag">&lt;/<span class="hljs-title">h2</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">form</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"row"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span> <span class="hljs-attribute">md-no-float</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-icon</span> <span class="hljs-attribute">md-svg-icon</span>=<span class="hljs-value">"action:ic_search_24px"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">md-icon</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text"</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">id</span>=<span class="hljs-value">"search"</span> <span class="hljs-attribute">placeholder</span>=<span class="hljs-value">"Search"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Search"</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">span</span> <span class="hljs-attribute">flex</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">span</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-select</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"orderProperty"</span> <span class="hljs-attribute">placeholder</span>=<span class="hljs-value">"Sort Order"</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">md-option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"1"</span>&gt;</span>Ascending<span class="hljs-tag">&lt;/<span class="hljs-title">md-option</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">md-option</span> <span class="hljs-attribute">value</span>=<span class="hljs-value">"-1"</span>&gt;</span>Descending<span class="hljs-tag">&lt;/<span class="hljs-title">md-option</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-select</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"angular-google-map-container"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">ui-gmap-google-map</span> <span class="hljs-attribute">center</span>=<span class="hljs-value">"map.center"</span> <span class="hljs-attribute">zoom</span>=<span class="hljs-value">"map.zoom"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">ui-gmap-markers</span> <span class="hljs-attribute">models</span>=<span class="hljs-value">"parties"</span> <span class="hljs-attribute">coords</span>=<span class="hljs-value">"'location'"</span> <span class="hljs-attribute">click</span>=<span class="hljs-value">"onClicked()"</span>
                         <span class="hljs-attribute">fit</span>=<span class="hljs-value">"true"</span> <span class="hljs-attribute">idkey</span>=<span class="hljs-value">"'_id'"</span> <span class="hljs-attribute">doRebuildAll</span>=<span class="hljs-value">"true"</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">ui-gmap-markers</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">ui-gmap-google-map</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span> <span class="hljs-attribute">layout-padding</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">dir-paginate</span>=<span class="hljs-value">"party in parties | itemsPerPage: perPage"</span> <span class="hljs-attribute">total-items</span>=<span class="hljs-value">"partiesCount.count"</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"row"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">flex</span>=<span class="hljs-value">"80"</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">h2</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">a</span> <span class="hljs-attribute">href</span>=<span class="hljs-value">"/parties/</span></span></span><span class="hljs-expression">{{<span class="hljs-variable">party.</span>_<span class="hljs-variable">id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-value">"</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.name</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">a</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">h2</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span></span><span class="hljs-expression">{{<span class="hljs-variable">party.description</span>}}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">span</span> <span class="hljs-attribute">flex</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">span</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"remove(party)"</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"$root.currentUser &amp;&amp; $root.currentUser._id == party.owner"</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-title">md-icon</span> <span class="hljs-attribute">md-svg-icon</span>=<span class="hljs-value">"content:ic_clear_24px"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">md-icon</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"$root.currentUser"</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"row"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"rsvp(party._id, 'yes')"</span>&gt;</span>I'm going!<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"rsvp(party._id, 'maybe')"</span>&gt;</span>Maybe<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"rsvp(party._id, 'no')"</span>&gt;</span>No<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"party.public"</span>&gt;</span>
        Everyone is invited
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-hide</span>=<span class="hljs-value">"$root.currentUser"</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">i</span>&gt;</span>Sign in to RSVP for this party.<span class="hljs-tag">&lt;/<span class="hljs-title">i</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">strong</span>&gt;</span>Who is coming:<span class="hljs-tag">&lt;/<span class="hljs-title">strong</span>&gt;</span>
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
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">md-list</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"!party.public"</span>&gt;</span>
        Users who haven't responded:
        <span class="hljs-tag">&lt;<span class="hljs-title">md-list-item</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"invitedUser in outstandingInvitations(party)"</span>&gt;</span>
            </span><span class="hljs-expression">{{ <span class="hljs-variable">invitedUser</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml">
        <span class="hljs-tag">&lt;/<span class="hljs-title">md-list-item</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">md-list</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-title">small</span>&gt;</span>Posted by </span><span class="hljs-expression">{{ <span class="hljs-variable">creator</span>(<span class="hljs-variable">party</span>) | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">small</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">dir-pagination-controls</span> <span class="hljs-attribute">on-page-change</span>=<span class="hljs-value">"pageChanged(newPageNumber)"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">dir-pagination-controls</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">md-content</span>&gt;</span></span>
</code></pre>

	    <btf-markdown>

First we wrapped everything into the `md-content` tag. We replaced all the buttons with `md-button` tags. We also wrapped form inputs into `md-input-container` tags which enable the Material Design style labels for inputs.
One new thing we also have to add is usage of Material Design icon set. Google provides free icons for Material Design. You can install it by typing: 

    meteor add planettraining:material-design-icons

We have to define the `$mdIconProvider` in the `client/app.js`. Insert these lines after the `angular.module` declaration: 

    var themeIcons = function ($mdIconProvider) {
    
      $mdIconProvider
        .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
        .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
        .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
        .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
        .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
        .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
        .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg");
    
    };
    
    angular.module('socially')
      .config(themeIcons);

You don't have to define all these icon sets. You just need to define those you need to use. You can see a full list of available icons [here](http://google.github.io/material-design-icons/). You can see in the view code above that to use icons you write:

	    </btf-markdown>

<pre><code>&lt;md-<span class="hljs-attribute">icon</span> md-svg-<span class="hljs-attribute">icon</span>=<span class="hljs-string">"content:ic_clear_24px"</span>&gt;&lt;/md-<span class="hljs-attribute">icon</span>&gt;
</code></pre>

	    <btf-markdown>

in the `md-svg-icon` attribute you list `<iconset>:<icon_name>` in our case `content:ic_clear_24px`. 

Now, replace the code in the `client/view/party-details.ng.html` with the following code:

	    </btf-markdown>

<pre><code><span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">legend</span>&gt;</span>
  Here you will see and change the details of the party:
<span class="hljs-tag">&lt;/<span class="hljs-title">legend</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-title">form</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"column"</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Party Name<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"party.name"</span> <span class="hljs-attribute">ng-disabled</span>=<span class="hljs-value">"party.owner != $root.currentUser._id"</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Name"</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">md-input-container</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">label</span>&gt;</span>Party Description<span class="hljs-tag">&lt;/<span class="hljs-title">label</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">input</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"party.description"</span> <span class="hljs-attribute">ng-disabled</span>=<span class="hljs-value">"party.owner != $root.currentUser._id"</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Description"</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">md-input-container</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">md-checkbox</span> <span class="hljs-attribute">ng-model</span>=<span class="hljs-value">"party.public"</span> <span class="hljs-attribute">ng-disabled</span>=<span class="hljs-value">"party.owner != $root.currentUser._id"</span> <span class="hljs-attribute">aria-label</span>=<span class="hljs-value">"Public"</span>&gt;</span>
      Is public
  <span class="hljs-tag">&lt;/<span class="hljs-title">md-checkbox</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">layout</span>=<span class="hljs-value">"row"</span> <span class="hljs-attribute">layout-align</span>=<span class="hljs-value">"left"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"save()"</span>&gt;</span>Save<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"reset()"</span>&gt;</span>Reset form<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-href</span>=<span class="hljs-value">"/parties"</span>&gt;</span>Cancel<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">md-list</span> <span class="hljs-attribute">ng-show</span>=<span class="hljs-value">"canInvite()"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-subheader</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"md-no-sticky"</span>&gt;</span>Users to invite:<span class="hljs-tag">&lt;/<span class="hljs-title">md-subheader</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-list-item</span> <span class="hljs-attribute">ng-repeat</span>=<span class="hljs-value">"user in users | uninvited:party"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span></span><span class="hljs-expression">{{ <span class="hljs-variable">user</span> | <span class="hljs-variable">displayName</span> }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-click</span>=<span class="hljs-value">"invite(user)"</span>&gt;</span>Invite<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">md-list-item</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">md-list-item</span> <span class="hljs-attribute">ng-if</span>=<span class="hljs-value">"(users | uninvited:party).length &lt;= 0"</span>&gt;</span>
      Everyone are already invited.
    <span class="hljs-tag">&lt;/<span class="hljs-title">md-list-item</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">md-list</span>&gt;</span>

  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"angular-google-map-container"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-title">ui-gmap-google-map</span> <span class="hljs-attribute">center</span>=<span class="hljs-value">"map.center"</span> <span class="hljs-attribute">events</span>=<span class="hljs-value">"map.events"</span> <span class="hljs-attribute">zoom</span>=<span class="hljs-value">"map.zoom"</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-title">ui-gmap-marker</span> <span class="hljs-attribute">coords</span>=<span class="hljs-value">"party.location"</span> <span class="hljs-attribute">options</span>=<span class="hljs-value">"map.marker.options"</span> <span class="hljs-attribute">events</span>=<span class="hljs-value">"map.marker.events"</span> <span class="hljs-attribute">idkey</span>=<span class="hljs-value">"party._id"</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">ui-gmap-marker</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-title">ui-gmap-google-map</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">form</span>&gt;</span></span>
</code></pre>

	    <btf-markdown>

Here, a you can see a specific type of button used by angular-material. We have a link button:

	    </btf-markdown>

    <pre><code><span class="hljs-tag">&lt;<span class="hljs-title">md-button</span> <span class="hljs-attribute">ng-href</span>=<span class="hljs-value">"/parties"</span>&gt;</span>Cancel<span class="hljs-tag">&lt;/<span class="hljs-title">md-button</span>&gt;</span>
    </code></pre>

	    <btf-markdown>

Angular-material makes a regular button that points to a link using `ng-href`. 

This is all we have to do to use angular-material in our application.



      </btf-markdown>
    </do-nothing>

    <div class="col-md-12">
	    <ul class="btn-group tutorial-nav">
		    <a href="/tutorial/step_17"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
		    <a href="http://socially-step18.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
		    <a href="https://github.com/Urigo/meteor-angular-socially/compare/step_17...step_18"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
		    <a href="/tutorial/next_steps"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
	    </ul>
    </div>
  </div>



