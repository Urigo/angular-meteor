
  <div class="row">
    <div class="col-md-12">
        <a href="https://github.com/Urigo/angular-meteor/edit/master/.docs/angular-meteor/client/views/steps/tutorial.step_00.tpl"
           class="btn btn-default btn-lg improve-button">
          <i class="glyphicon glyphicon-edit">&nbsp;</i>Improve this doc
        </a>
        <ul class="btn-group tutorial-nav">
          <a href="/tutorial"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
          <a href="http://socially-step00.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
          <a href="https://github.com/Urigo/meteor-angular-socially/compare/afd6d42e02b4518652e4061a215728a7b45d2ffb...01d51d5cb9f704478379c67195600dd831487b81"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
          <a href="/tutorial/step_01"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
        </ul>
    </div>

      <div class="col-md-8">
        <h1>Step 0</h1>
      </div>
      <div class="video-tutorial col-md-4">
        <iframe width="300" height="169" src="//www.youtube.com/embed/LVuCeKswPPE?list=PLhCf3AUOg4PgQoY_A6xWDQ70yaNtPYtZd" frameborder="0" allowfullscreen></iframe>
      </div>
    <do-nothing class="col-md-12">
      <btf-markdown>

You are now ready to build the Meteor-Angular socially app.

In this step, you will become familiar with the most important source code files,
learn how to start the Meteor server, connect an AngularJS FrontEnd to it and run the application in the browser.

First step - let's install Meteor!

Open your command line and paste this command:

    $ curl https://install.meteor.com/ | sh

Now let's create our app - write this in the command line:

    $ meteor create socially

Now let's see what we got.  go into the folder:

    $ cd socially

and run the app like so:

    $ meteor

    => Started proxy
    => Started MongoDB.
    => Started your app.
    >=> App running at: http://localhost:3000/

Now go to [http://localhost:3000/](http://localhost:3000/)
and look at the amazing app that's running on your computer!

So, as you can see, we have a full running app! which includes a server and a client.

But let's start from the beginning, please delete the following files:

    socially.css	socially.html	socially.js

Now we can start building our app.
first let's create a new index.html file and place this code inside and run the app again:

__`index.html`:__

          </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">body</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>Nothing here<span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">body</span>&gt;</span>
</code></pre>

      <btf-markdown>

As you can see, there is no html tag, no head tag, very simple.


The reason is the way Meteor structures and serves files to the client.

Meteor scans all the HTML files in your application and concatenates them together.

It will create the HTML, HEAD and BODY tags by itself and place in there everything it needs to run the app.

Then it will search for all the HTML files containing HEAD or BODY tags and concatenate their content into the main file.



So in our case, Meteor found our index.html file, found the BODY tag inside and added it's content to the BODY tag of the main generated file.

(right-click -> inspect element on the page to see the generated file)



Now it's time to add AngularJS to our stack!

Now first things first, let's add the AngularJS package to Meteor (we will discuss more about Meteor packages later in this tutorial)



Back in the command line, launch this command:

    $ meteor add urigo:angular

This package takes care of including the latest AngularJS library code into our app.

That's it! now we can use the AngularJS power in our Meteor app.

To start simple, create a new file called index.tpl under the main folder, this will be our main HTML template page.

* We are using the .tpl file extension so that Blaze - Meteor's templating system won't compile and override our AngularJS expressions.

Then move the p tag into it:

__`index.tpl`:__

          </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>Nothing here<span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span>
</code></pre>

      <btf-markdown>

Now let's include that file into our main index.html file:

__`index.html`:__

      </btf-markdown>

<pre><code>
<span class="hljs-tag">&lt;<span class="hljs-title">body</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-title">div</span> <span class="hljs-attribute">ng-include</span>=<span class="hljs-value">"'index.tpl'"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-title">body</span>&gt;</span>
</code></pre>

      <btf-markdown>

Now run the app.  everything is the same.  now let's start AngularJS:

inside index.html add an ng-app attribute on the DIV like that:

</btf-markdown>
<pre><code>
&lt;<span class="hljs-operator">div</span> ng-app ng-<span class="hljs-built_in">include</span>=<span class="hljs-string">"'index.tpl'"</span>&gt;&lt;/<span class="hljs-operator">div</span>&gt;
</code></pre>
<btf-markdown>

and now inside our index.tpl let's use Angular:

</btf-markdown>

<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>Nothing here </span><span class="hljs-expression">{{ '<span class="hljs-variable">yet</span>' + '!' }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>

<btf-markdown>

# What is the code doing?
double curly braces binding with an expression:

    Nothing here {{'yet' + '!'}}

This line demonstrates two core features of Angular's templating capabilities:

* A binding, denoted by double curly braces {{ }}
* a simple expression 'yet' + '!' used in this binding.

AngularJS finds those double curly braces, evaluates the expression and inserts the result into the DOM in place of the binding.
Rather than a one-time insert, as we'll see in the next steps, a binding will result in efficient continuous updates whenever the result of the expression evaluation changes.
Inside in the client side, like a future smart browser would do.


> Why did use a new file extension file.tpl ?
>
> That is because Meteor templating system uses double-curlies. If we use them in our AngularJS view HTML, Meteor will override Angular.
>
> Fortunately, we created a new file extension to make Meteor not override our Angular expression.
>
> If you still want to use HTML files without changing their extension, Angular (unlike Meteor...) gives us the [option to change the double-curlies to Double-square-brackets](http://stackoverflow.com/a/12923955/1426570)



# Experiments
Try adding a new expression to the index.tpl that will do some math:

</btf-markdown>

<pre><code>
<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">p</span>&gt;</span>1 + 2 = </span><span class="hljs-variable">{{ 1 + 2 }}</span><span class="xml"><span class="hljs-tag">&lt;/<span class="hljs-title">p</span>&gt;</span></span>
</code></pre>

<btf-markdown>

# Summary
Now let's go to [step 1](step_01) and add some content to the web app.


        </btf-markdown>
    </do-nothing>

    <ul class="btn-group tutorial-nav">
      <a href="/tutorial"><li class="btn btn-primary"><i class="glyphicon glyphicon-step-backward"></i> Previous</li></a>
      <a href="http://socially-step00.meteor.com/"><li class="btn btn-primary"><i class="glyphicon glyphicon-play"></i> Live Demo</li></a>
      <a href="https://github.com/Urigo/meteor-angular-socially/compare/afd6d42e02b4518652e4061a215728a7b45d2ffb...01d51d5cb9f704478379c67195600dd831487b81"><li class="btn btn-primary"><i class="glyphicon glyphicon-search"></i> Code Diff</li></a>
      <a href="/tutorial/step_01"><li class="btn btn-primary">Next <i class="glyphicon glyphicon-step-forward"></i></li></a>
    </ul>
  </div>

