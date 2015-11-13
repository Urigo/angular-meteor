{{#template name="tutorials.whatsapp.ionic.step_01.md"}}
Now we have an app.  let’s make it look like Whatsapp.
We are going to start with the Chats list.

As this chapter is just about UI, to make things short, you can download the end result of this step [here](https://github.com/idanwe/ionic-whatsapp/archive/7b5569653f8ef732c10f7b261e4334b15a883099.zip).

To follow the complete list of step by step changes, please check out the commit list [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/commits/master?page=4) (From 2.1 to 2.24).

Running the result of step 2 on the iOS simulator:

    $ npm install -g ios-sim
    $ cordova platform add ios
    $ ionic emulate

And it should look like that:

{{tutorialImage 'ionic' '1.png' 500}}

And if you swipe a menu item to the left:

{{tutorialImage 'ionic' '2.png' 400}}

So if you reach here, we understand that that mocking the WhatsApp view is a something you interested in - so let's begin!

## Configuring the module, routes and config

So in this point we have the default HTML, CSS and JavaScript files of ionic tabs project - so first let's add the tabs we actualy want.

So we will add the following tabs: Favorites, Recents, Contacts, Chats and Settings (we will not implement all of them in this tutorial - but we will add it now in order to get a better UI result).

We will use ionic's `ion-tabs` and `ion-tab` directives, and add it for each one of the tabs we want:

{{> DiffBox tutorialName="ionic-tutorial" step="1.1"}}

And we will change the default app name:

{{> DiffBox tutorialName="ionic-tutorial" step="1.2" filename="www/js/app.js"}}

Now let's create a file named `services.js` an put in in some static data that we will later serve from the Meteor server.

{{> DiffBox tutorialName="ionic-tutorial" step="1.3"}}

Our next step is to add the `moment` package, we will use it later to convert timestamps and time objects.

We will do it by running the following command:

    $ bower install moment --save

{{> DiffBox tutorialName="ionic-tutorial" step="1.4"}}

And let's include `moment` package to the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.5"}}

Our next step is to create the chats list view, we will use `ion-list` and `ion-item` directives, which provides us a list view.
We use our static data for the `ng-repeat` and we will display the chat's name, image and timestamp.

{{> DiffBox tutorialName="ionic-tutorial" step="1.6"}}

Note that in this step, the chat's date will display in timestamp format, so let's create a filter that uses `moment` to convert it:

{{> DiffBox tutorialName="ionic-tutorial" step="1.7"}}

And add it in the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.8"}}

And let's use this filter in our view:

{{> DiffBox tutorialName="ionic-tutorial" step="1.9"}}

And let's some more small changes to get a better UI:

{{> DiffBox tutorialName="ionic-tutorial" step="1.10"}}

Now let's remove the old tabs code, which we do not use anymore:

`www/templates/tab-account.html`

`www/templates/tab-dash.html`

And also remove those routes from the routes file:

{{> DiffBox tutorialName="ionic-tutorial" step="1.12"}}

And also remove those controllers:

{{> DiffBox tutorialName="ionic-tutorial" step="1.13"}}

Now let's move the `ChatsCtrl` to separated file to keep our project organized.

{{> DiffBox tutorialName="ionic-tutorial" step="1.14" filename="www/js/controllers/chats.controller.js"}}

> Do not forget to remove it from the `www/js/controllers.js` file!

And add the new file to the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.15"}}

Our next step is to create the controller for the chat detail, so let's create it:

{{> DiffBox tutorialName="ionic-tutorial" step="1.16" filename="www/js/controllers/chat-detail.controller.js"}}

And add it to the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.16" filename="www/index.html"}}

> In this step we can also delete the `controllers.js` file because we moved it to separated files.

Our next step is to split the main app file (`app.js`), so let's start with the routes and create `www/js/routes.js`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.17" filename="www/js/routes.js"}}

> Also, remove this content from the `app.js` file!

And add the `routes.js` file to the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.18"}}

Also, move the `config` phase to a new file - `www/js/config.js`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.19" filename="www/js/config.js"}}

> Also, remove this content from the `app.js` file!

And include it the `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="1.19" filename="www/index.html"}}

And let's add some code-style ([John Papa](https://github.com/johnpapa/angular-styleguide)) to the main app file:

{{> DiffBox tutorialName="ionic-tutorial" step="1.20"}}

Now let's add SASS support to our project by running the following command:

    $ ionic setup sass

Let's create a `.scss` file for our chats list and and some CSS rules:

{{> DiffBox tutorialName="ionic-tutorial" step="1.22"}}

And import the new file inside ionic's main `scss` file:

{{> DiffBox tutorialName="ionic-tutorial" step="1.23" filename="scss/ionic.app.scss"}}

> You can also now remove the old and default CSS file located in: `www/css/style.css`

And that's it!

So now we have a nice tabs view with some style and static data - in the next steps we will add the server side and some more cool features!

{{/template}}
