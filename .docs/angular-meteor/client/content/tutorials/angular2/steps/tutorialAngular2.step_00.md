{{#template name="tutorialAngular2.step_00.html"}}

> Disclaimer: Angular 2 is not yet production ready. The API will change. For now, consider this tutorial for educational purposes.

Let's start building our Meteor Angular 2 Socially app.

In this step, you will:

- Become familiar with the most important source code files
- Learn how to start the Meteor server
- Connect an Angular 2 FrontEnd
- Run the application in the browser

## Meteor Setup

First step - let's install Meteor!

Open your command line and paste this command:

    $ curl https://install.meteor.com/ | sh

> If you are on a Windows machine, go [here](https://www.meteor.com/install) to install

Now let's create our app - write this in the command line:

    $ meteor create socially

Now let's see what we got. Go into the folder:

    $ cd socially

and run the app like so:

    $ meteor

    => Started proxy
    => Started MongoDB.
    => Started your app.
    >=> App running at: http://localhost:3000/

Now go to [http://localhost:3000/](http://localhost:3000/)
and look at the amazing app that's running on your computer!

So, as you can see, we have a full running app which includes a server and a client!

The default Meteor app starts life with three files, one `js`, one `html` and one `css` file. Each named with the application name you used in the `create` command above. In our case this is `socially`.

We are going to add our own files for this tutorial. So let's start by deleting the following files:

    - socially.css    (delete)
    - socially.html   (delete)
    - socially.js     (delete)

Now we can start building our app.

Create a directory called `client`. It is important that the name is `client`. Meteor will run files inside this directory only on the client. More about that in step 7.

First, let's create a new `index.html` file and place this code inside. Then run the app again:

{{> DiffBox tutorialName="angular2-meteor" step="0.1"}}

As you can see, there is no html tag, no head tag, very simple.

The reason for this is the way Meteor structures and serves files to the client.

Meteor scans all the HTML files in your application and concatenates them together.

It will create the `HTML`, `HEAD` and `BODY` tags by itself and place in there everything it needs to run the app.

Then it will search for all the HTML files containing `HEAD` or `BODY` tags and concatenate their content into the main file.


So in our case, Meteor found our `index.html` file, recognized it was meant for the client only, found the `BODY` tag inside and added it's content to the `BODY` tag of the main generated file.

> (right-click -> inspect element on the page to see the generated file)

## Angular 2 Package

Now it's time to add Angular 2 to our stack!

First things first, let's add the Angular 2 package to Meteor (we will discuss more about Meteor packages later in this tutorial)

Back in the command line, launch this command:

    $ meteor add shmck:angular2

This package takes care of connecting Angular to Meteor and includes the latest Angular 2 library code into our app.

## TypeScript

In this tutorial, we'll be using TypeScript. Don't worry if you're not familiar with TypeScript. Valid JavaScript is valid TypeScript.

TypeScript just adds more optional features to JavaScript such as types & interfaces. You'll be able to do this tutorial fine without understanding what these are yet; but if you'd like to learn more try the [TypeScript tutorial] ([Learn more](http://www.typescriptlang.org/Tutorial)).

Why TypeScript? It's true, Angular 2 can be written in regular JavaScript (ES5), the new JavaScript (ES2015 aka ES6) or TypeScript. However, TypeScript is the recommended choice by the Angular team. As we progress, I hope you'll come to understand why.

Install a TypeScript compiler with Angular 2 features enabled. In the command line:

    $ meteor add netanelgilad:angular2-typescript

This compiler will convert our `.ts` files to valid `.js` files.

ES2015 & TypeScript both use modules. These are the `import` and `export` statements that have arrived in JavaScript.

{{> DiffBox tutorialName="angular2-meteor" step="0.2"}}

## System.js

System.js is a module loader built into the `shmck:angular2` package. We'll use it to load our root component.

{{> DiffBox tutorialName="angular2-meteor" step="0.3"}}

Here we're telling System.js to load `app.js`, which is compiled from our `app.ts` file.

Once we've created our `app.ts` file we can use Angular 2 in our Meteor app.

## Root Component

A component is a controller with an attached view. Think of it like a brick in the castle of your app.

We'll create a root component tag called `app`. Let's include that component into our main `index.html` file:

{{> DiffBox tutorialName="angular2-meteor" step="0.4"}}

But if you load this in your browser, **you won't see anything**. That's because we still need to **create the actual Angular 2 component**, which we'll do next.

# Angular 2 Component

Angular 2 code is structured like a tree of components inside of each other. So let's create our root component which other components will stem out of.

Create a new `app.ts` file inside of the `client` folder.

Now you can see another example of Meteor's power and simplicity - no need to include this file anywhere. Meteor will take care of it by going through all the files in the folder and including them automatically.

Let's continue defining our Angular 2 application module.

{{> DiffBox tutorialName="angular2-meteor" step="0.5"}}

First we're importing the dependencies we needed from `angular2/angular2`. This is not a folder and file in your directory, but referring to an alias provided to System.js in the `shmck:angular2` package.

Notice the `@` syntax. In Angular 2, these are called Annotations. They are similar to a new feature coming to ES2016 called Decorators. You can read more about the differences between the two [here](http://blog.thoughtram.io/angular/2015/05/03/the-difference-between-annotations-and-decorators.html).

Basically Annotations allow us to elegantly add metadata to classes. Just consider it pretty syntax for now.

Also notice the component Selector matches the `<app>` tag we provided in index.html, and View template creates the view.

The class, Socially, inherits from @Component and @View.

Finally, we `bootstrap` our component, marking it as the root component in `index.html`. An Angular 2 app can have multiple root components, but components must exist together within the same root in order to communicate with each other.

Now run the app.

    $ meteor

# Templates

Let's make one change. Create a new file called `index.ng.html` under the 'client' folder, this will be our main `HTML` template page.

* We are using the `.ng.html` file extension so that Blaze - Meteor's templating system won't compile and override our Angular 2 expressions.

Change your template in `app.ts` to target `index.ng.html`.

{{> DiffBox tutorialName="angular2-meteor" step="0.6"}}

Then move the `p` tag into it:

 {{> DiffBox tutorialName="angular2-meteor" step="0.7"}}

    
Now our component template will load from the given path. Let's use Angular inside of `index.ng.html` to see that's working:

    <p>Nothing here {{dstache}} 'yet' + '!' }}</p>

Run the app again and the screen should look like this:

    Nothing here yet!

Angular interpreted the expression like any other Angular application.

> If the template doesn't change, it may be because your browser is caching the original template.
> Learn [how to disable caching during development](https://developer.chrome.com/devtools/docs/settings) with Chrome.

# Notes

Again, Angular 2 is still in development. It is not recommended for production yet.

You may notice a `require` error in the console; however, the app will still run. This should be sorted out in the near future.

# Experiments
Try adding a new expression to the index.ng.html that will do some math:

    <p>1 + 2 = {{dstache}} 1 + 2 }}</p>

# Summary
Now let's go to [step 1](/tutorials/angular2/static-template) and add some content to our application.

{{/template}}
