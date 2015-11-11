{{#template name="tutorials.whatsapp.ionic.step_00.md"}}
Both Meteor and Ionic took their platform to the next level in tooling.
Both provide CLI interface instead of bringing bunch of dependencies and configure build tools.
There is also differences between those tools, in this post we will focus on the Ionic CLI.

To start, let’s install Ionic with Npm. In your command line:

    $ npm install -g ionic

Now let’s create a new Ionic app with the tabs template:

    $ ionic start whatsapp tabs

Now inside the app’s folder, run:

    $ npm install
    $ bower install

Let’s run this default app, in the command line:

    $ ionic serve

to run inside browser, or:

    $ ionic emulate

to run inside a simulator.

{{/template}}
