{{#template name="tutorials.whatsapp.meteor.step_01.md"}}
We will start by creating the project’s folder structure, Meteor has a special behavior for certain folders:

* client - these files will be available only in the client side.
* server - these files will be available only in the server side.
* public - these files will be available in the client, uses for assets, images, fonts, etc.
* lib - any folder named lib (in any hierarchy) will be loaded first!
* any other folder name will be included in both client and server and uses for code-sharing.

So this will be our folder structure to the project:

* client (client side with AngularJS and Ionic code)
*    - scripts
*     - templates
*     - styles
*     - index.html
* server (server side code only)
* public (assets, images)
* lib (define methods and collections in order to make them available in both client and server)

So let’s start by creating our first file - the `index.html` file - we will place in under the `client` folder:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.2"}}

We used some ionic tags to achieve mobile style:

* ion-nav-bar - Create a navigation bar in the page header.
* ion-nav-view - This is a placeholder to the real content - AngularJS and ionic will put your content inside this tag automatically.

Note that we only provide the `head` and `body` tags because Meteor takes care of the full contents of the HTML file, and any tag we will use here will be added to the Meteor’s main index.html file.

This feature is really useful because we do not need to take care of including our files in `index.html` and keep it updated ourselves.

Our next step is to create the AngularJS module and bootstrap it according to our platform. 
We will create a new file called `app.js`.

This bootstrap file should be loaded first, because any other AngularJS code will depend on the module, so we need to put this file inside a folder called `lib`, so we will create a file in this path: `client/scripts/lib/app.js`.

This file will contain an AngularJS module initialization with dependencies for `angular-meteor` and `ionic`.

We will also check for the current platform (browser or mobile) and initialize the module according to the result:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.3"}}

Our next step is to create the states and routes for the views.

Our app uses Ionic to create 5 tabs: Favorites, Recents, Contacts, Chats, and Settings.

We will define our routes and states with [angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router) (which is included by ionic), and for the moment we will add the main page which is the `chats` tab:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.4"}}

And this is the HTML template for the footer that included with the tabs view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.5"}}

Create the stub for the main page - the chats file:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.6"}}

And this is what it looks at the moment, inside a browser:

{{tutorialImage 'whatsapp-meteor' '1.png' 500}}

If you want to view your app in a better way, with mobile layout, you can add a mobile platform as we described in the beginning of the step. I’ve added the iOS platform, and when we can run it inside a mobile emulator, and it looks like this:

{{tutorialImage 'whatsapp-meteor' '2.png' 500}}

Our next step includes creating basic views with some static data using `ionic` and `SASS`.

First, let’s create an AngularJS controller that we will later connect to the chats view, we will call it `ChatsCtrl` and create a new file:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.8"}}

We will use the controller with `conrollerAs` syntax, which means we won't put our variables on the `$scope` - we will use `this` context instead.


Also, we injected the `$reactive` service, which is part of Angular-Meteor, and we used our `this` context and attached in to our `$scope`.


`$reactive` will extend our controller with new functionality like creating Meteor helpers, subscription and use Autorun - all of these from our AngularJS controller context.


Now we want to add some static data to this controller, we will use `moment` package to easily create time object, so let’s add it to the project using this command:

    $ meteor add momentjs:moment

Now let’s add the static data, we will create a stub schema for chats and messages:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.10"}}

Connect the chats view to the `ChatsCtrl`:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.11"}}

Note that we used `controllerAs` syntax, so from now on, we will keep our controller variables on the `this` context, and we will used them with the `chats` prefix on the view.

Modify the chats list view to use the stub data.

We will use ionic’s tags to create a container with a list view (`ion-list` and `ion-item`), and add `ng-repeat` to iterate over the chats:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.12"}}

And this is how is looks like:

{{tutorialImage 'whatsapp-meteor' '3.png' 500}}

You might notice that the dates are not formatted, so let’s create a simple AngularJS filter that use `moment` package to convert the date into formatted text, we will place it in a file named `client/scripts/filters/calendar.filter.js`:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.13"}}

And let’s use it in our view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.14"}}

And this how it looks like now:

{{tutorialImage 'whatsapp-meteor' '4.png' 500}}

To add a delete button to our view, we will use `ion-option-button` which is a button that’s visible when we swipe over the list item!

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.15"}}

Implement the `remove(chat)` method inside our `ChatsCtrl`:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.16"}}

And this is the result:

{{tutorialImage 'whatsapp-meteor' '5.png' 500}}

Now we want to add some styles and make some small CSS modifications to make it look more like WhatsApp.

We want to use SASS in our project, so we need to add the sass package to our project:

    $ meteor add fourseven:scss

And now we will create our first SASS file, we will place it under `client/styles/chats.scss`, and add some CSS rules:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="1.18"}}

And we are done with this view! It look just like WhatsApp!

{{tutorialImage 'whatsapp-meteor' '6.png' 500}}

{{/template}}
