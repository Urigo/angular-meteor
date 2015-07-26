{{#template name="angular-step01"}}
# Creating your first angular-meteor app

In this tutorial, we are going to create the same 'todo' app as in the other tutorial, but this time using the [angular-meteor](http://angular-meteor.com) package to integrate angular as our reactive front-end.

To create a Meteor app, open your terminal and type:

```bash
meteor create simple-todos-angular
```

This will create a new folder called `simple-todos-angular` with all of the files that a Meteor app needs:

```bash
simple-todos-angular.js       # a JavaScript file loaded on both client and server
simple-todos-angular.html     # an HTML file that defines our main view
simple-todos-angular.css      # a CSS file to define your app's styles
.meteor                       # internal Meteor files
```

To run the newly created app:

```bash
cd simple-todos-angular
meteor
```

Open your web browser and go to `http://localhost:3000` to see the app running.

You can play around with this default app for a bit before we continue. For example, try editing the text in `<h1>` inside `simple-todos-angular.html` using your favorite text editor. When you save the file, the page in your browser will automatically update with the new content. We call this "hot code push".

Now that you have some experience editing the files in your Meteor app, let's start working on a simple todo list application.
{{/template}}
