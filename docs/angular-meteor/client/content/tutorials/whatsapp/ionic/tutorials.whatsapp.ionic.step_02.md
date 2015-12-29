{{#template name="tutorials.whatsapp.ionic.step_02.md"}}
Now that we have the layout and some dummy data, let’s create a Meteor server and connect to it to make our app real.

First download Meteor from the Meteor site: [https://www.meteor.com/](https://www.meteor.com/)

Now let’s create a new Meteor server inside our project..
Open the command line in our app’s root folder and type:

    $ meteor create server

We just created a live and ready example Meteor app inside a `server` folder.

Delete the example app by deleting the following files from the `server` folder:

* `server.css`
* `server.html`
* `server.js`

Now we are ready to write some server code.

Let’s define two data collections, one for our Chats and one for Messages inside those chats.

Create a `lib` folder inside our `server` folder and add a `collections.js` file which initialize those collections:

{{> DiffBox tutorialName="ionic-tutorial" step="2.2"}}

{{> DiffBox tutorialName="ionic-tutorial" step="2.3"}}

> We place those collections inside a `lib` folder because Meteor loads the `lib` folder prior to other folders!

Now we have the collections defined, let’s add the dummy data to the collection, so the client will be able to get them from the server, instead from a static file (`Chats` service).

Create a file named `bootstrap.js` inside the `server` folder and place that initialization code inside:

{{> DiffBox tutorialName="ionic-tutorial" step="2.4"}}

The code is pretty easy and self explanatory.

> Notice the we used `Meteor.isServer`, that’s because Meteor has the ability to run the same code on both client and server. We won’t use this ability here because we are using a separate frontend, but it’s important to know about that ability

You can see we are using the `moment` library inside this code, so let’s add the `moment` package to our server with Meteor’s package manager.

Navigate the command line to the `server` folder in our app and type:

    $ meteor add momentjs:moment

Another interesting thing about Meteor, is that it comes with `ES2015` support out of the box for all Javascript files.

So let’s use `ES2015` on this file as well:

{{> DiffBox tutorialName="ionic-tutorial" step="2.6"}}

We our server is ready!
All we have to do is to start it is to write `meteor` inside the `server` directory command line:

    $ meteor

Now let’s connect our client to our Meteor server.

First let’s bring Meteor’s powerful client side tools that will help us easily sync to the Meteor server in real time.
Navigate the command line into your project’s root folder and type:

    $ bower install meteor-client-side --save

Update the new dependencies in the `index.html` file:

{{> DiffBox tutorialName="ionic-tutorial" step="2.8"}}

Now let’s add the `angular-meteor` package to help us sync Meteor to our Angular app.

Type in the command line:

    $ bower install angular-meteor --save

Update the new dependencies in the `index.html` file:

{{> DiffBox tutorialName="ionic-tutorial" step="2.10"}}

and add the `angular-meteor dependency to our Angular app:

{{> DiffBox tutorialName="ionic-tutorial" step="2.11"}}

Now let’s create the same collections we defined on our server in our client app.

Create a new file named `collections.js` under the `www/js` folder and app the collections there:

{{> DiffBox tutorialName="ionic-tutorial" step="2.12"}}

And don’t forget to update the `index.html` with the new file:

{{> DiffBox tutorialName="ionic-tutorial" step="2.13"}}

Now let’s bind those collections to Angular `ChatsCtrl` controller.

We will use `$scope.helpers`, each key will be available on the template and will be updated when it changes [read more about helpers in the API](http://www.angular-meteor.com/api/helpers).

{{> DiffBox tutorialName="ionic-tutorial" step="2.14"}}

Now our app with all its clients is synced with our server in real time!

To test it, you can open another browser, or another window in incognito mode, open another client side by side and delete a chat (by swiping the chat to the left and clicking `delete`).

See the chat is being deleted and updated in all the connected client in real time!

{{tutorialImage 'ionic' '3.png' 500}}

Now let’s bind a specific chat to to server inside the `ChatDetailsCtrl` controller:

{{> DiffBox tutorialName="ionic-tutorial" step="2.15"}}

> Notice this is exactly the same collections as the server. adding `meteor-client-side` to our project has created `Minimongo` on our client side. `Minimongo` is a client side cache with exactly the same API as the Mongo database.

> Meteor will take care of syncing the data automatically with the server

> On the Meteor platform you won’t have to write that code twice, with Meteor’s build process you can write that code once and run that code everywhere.

> Notice that we have a static separate Front End app that works with a Meteor server. you can use Meteor as a backend server to any Front End app without changing anything in your app structure or build process

We can now remove the client side mock data service we used before:

{{> DiffBox tutorialName="ionic-tutorial" step="2.16"}}

{{> DiffBox tutorialName="ionic-tutorial" step="2.17"}}

You can download a ZIP file with the project at this point [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/archive/3f74094749b2ccef9e03fb32903c676b6176d915.zip).

{{/template}}
